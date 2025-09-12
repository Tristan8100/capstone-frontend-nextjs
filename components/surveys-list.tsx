"use client"

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Search, FileText, Users, Calendar, Loader2 } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import AddSurvey from "./admin-components/add-survey"
import EditSurvey from "./admin-components/edit-survey"
import Link from "next/link"
import { Skeleton } from "@/components/ui/skeleton"
import { Dialog, DialogTrigger, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"

interface Survey {
  id: number
  title: string
  description: string | null
  created_at: string
  course: Course | null
  has_responded?: boolean
  status?: string
  limits?: {
    courses?: string[]
    institutes?: string[]
    readable?: string
  }
}

interface Course {
  id: string
  name: string
}

interface PaginatedResponse {
  data: Survey[]
  next_page_url: string | null
  current_page: number
  last_page: number
}

export default function SurveysList() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const [isLoading, setIsLoading] = useState(false)

  // Delete modal state
  const [deleteId, setDeleteId] = useState<number | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)
  const [openDialog, setOpenDialog] = useState(false)

  useEffect(() => {
    const fetchSurveys = async () => {
      setIsLoading(true)
      try {
        const response = await api2.get<PaginatedResponse>(
          `/api/surveys-admin?page=${currentPage}&search=${encodeURIComponent(searchTerm)}`
        )
        setSurveys(response.data.data)
        setLastPage(response.data.last_page)
        console.log(response.data)
      } catch (error) {
        console.error("Failed to fetch surveys:", error)
      } finally {
        setIsLoading(false)
      }
    }

    const debounceTimer = setTimeout(() => {
      fetchSurveys()
    }, 500)

    return () => clearTimeout(debounceTimer)
  }, [currentPage, searchTerm])

  const handleDeleteClick = (id: number) => {
    setDeleteId(id)
    setOpenDialog(true)
  }

  const confirmDelete = async () => {
    if (!deleteId) return
    setIsDeleting(true)
    try {
      await api2.delete(`/api/surveys/${deleteId}`)
      setSurveys((prev) => prev.filter((s) => s.id !== deleteId))
      // just refresh
      const response = await api2.get<PaginatedResponse>(
        `/api/surveys-admin?page=${currentPage}&search=${searchTerm}`
      )
      setSurveys(response.data.data)
      setLastPage(response.data.last_page)
    } catch (error) {
      console.error("Failed to delete survey:", error)
    } finally {
      setIsDeleting(false)
      setDeleteId(null)
      setOpenDialog(false)
    }
  }

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= lastPage) {
      setCurrentPage(newPage)
    }
  }

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold">Forms</h1>
            </div>
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search forms"
                className="pl-10 w-64"
                value={searchTerm}
                onChange={(e) => {
                  setSearchTerm(e.target.value)
                  setCurrentPage(1)
                }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent forms</h2>
            <p className="text-gray-600 mt-1">
              {isLoading
                ? "Loading..."
                : searchTerm
                ? `${surveys.length} result(s) for "${searchTerm}"`
                : "Manage and view your surveys"}
            </p>
          </div>
          <AddSurvey onSuccess={(newSurvey) => setSurveys([newSurvey, ...surveys])} />
        </div>

        {/* No Results */}
        {!isLoading && surveys.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-500">Try adjusting your search terms or create a new form.</p>
          </div>
        )}

        {/* Surveys Grid */}
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {[...Array(6)].map((_, i) => (
              <Card key={i} className="p-4 space-y-4">
                <Skeleton className="w-12 h-12 rounded-lg" />
                <Skeleton className="h-4 w-3/4" />
                <Skeleton className="h-3 w-1/2" />
                <Skeleton className="h-3 w-1/3" />
              </Card>
            ))}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {surveys.map((survey) => (
                <Card key={survey.id} className="hover:shadow-md transition-shadow cursor-pointer flex flex-col h-full">
                  <CardHeader className="flex-grow">
                    <div className="flex items-start justify-between">
                      <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="ghost" size="icon" className="w-8 h-8" disabled={isDeleting && deleteId === survey.id}>
                            {isDeleting && deleteId === survey.id ? (
                              <Loader2 className="w-4 h-4 animate-spin" />
                            ) : (
                              <MoreVertical className="w-4 h-4" />
                            )}
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                          <DropdownMenuItem>
                            <Link className="h-full w-full" href={`/admin/surveys/${survey.id}`}>
                              Show
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem>
                            <Link className="h-full w-full" href={`/admin/surveys/responses/${survey.id}`}>
                              Responses
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="text-red-600"
                            onClick={() => handleDeleteClick(survey.id)}
                          >
                            Delete
                          </DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                    <CardTitle className="text-lg line-clamp-2">{survey.title}</CardTitle>
                    <CardDescription className="line-clamp-2">{survey.description || "No description"}</CardDescription>
                  </CardHeader>
                  <CardContent>
                  <div className="flex flex-col space-y-2">
                    <div className="flex items-center text-sm text-gray-500">
                      <Calendar className="w-4 h-4 mr-2" />
                      <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                      {survey.status && (
                        <Badge variant="secondary" className="ml-2">
                          <span className="truncate">{survey.status}</span>
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-2">
                      <EditSurvey
                        survey={survey}
                        onSuccess={(updatedSurvey) =>
                          setSurveys((prev) =>
                            prev.map((s) => (s.id === updatedSurvey.id ? updatedSurvey : s))
                          )
                        }
                      />

                      {survey.limits && (
                        <div className="flex flex-wrap gap-2 mt-2">
                          {/* Courses add limits? if not defined */}
                          {survey.limits?.courses?.map((courseName: string, i: number) => (
                            <Badge key={`course-${i}`} variant="secondary" className="bg-purple-500 hover:bg-purple-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="truncate">{courseName}</span>
                            </Badge>
                          ))}

                          {/* Institutes */}
                          {survey.limits?.institutes?.map((instName: string, i: number) => (
                            <Badge key={`inst-${i}`} variant="secondary" className="bg-green-500 hover:bg-green-600">
                              <Users className="w-4 h-4 mr-1" />
                              <span className="truncate">{instName}</span>
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                </CardContent>
                </Card>
              ))}
            </div>

            {/* Pagination */}
            <div className="flex items-center justify-between mt-8">
              <p className="text-sm text-gray-600">
                Page {currentPage} of {lastPage}
              </p>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  disabled={currentPage === 1 || isLoading}
                  onClick={() => handlePageChange(currentPage - 1)}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  disabled={currentPage === lastPage || isLoading}
                  onClick={() => handlePageChange(currentPage + 1)}
                >
                  Next
                </Button>
              </div>
            </div>
          </>
        )}

        {/* Delete Confirmation Modal */}
        <Dialog open={openDialog} onOpenChange={setOpenDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Are you sure you want to delete this survey?</DialogTitle>
            </DialogHeader>
            <DialogFooter className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setOpenDialog(false)} disabled={isDeleting}>
                Cancel
              </Button>
              <Button variant="destructive" onClick={confirmDelete} disabled={isDeleting}>
                {isDeleting ? "Deleting..." : "Delete"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>
    </div>
  )
}
