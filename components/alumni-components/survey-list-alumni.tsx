'use client'

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { Button } from "@/components/ui/button"
import { Skeleton } from "@/components/ui/skeleton"  // 👈 skeleton component

interface Survey {
  id: number
  title: string
  description: string | null
  created_at: string
  has_responded: boolean
  course: Course | null
}

interface Course {
  id: number
  name: string
}

interface PaginatedResponse<T> {
  data: T[]
  current_page: number
  last_page: number
  total: number
}

export default function SurveysListUser() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const [status, setStatus] = useState("all")
  const [page, setPage] = useState(1)
  const [lastPage, setLastPage] = useState(1)
  const { user } = useAuth()
  const [debounceTimer, setDebounceTimer] = useState<NodeJS.Timeout | null>(null)
  const [loading, setLoading] = useState(false)

  const fetchSurveys = async () => {
    try {
      setLoading(true)
      const res = await api2.get<PaginatedResponse<Survey>>("/api/surveys-alumni", {
        params: {
          search: searchTerm,
          status,
          page,
          per_page: 8
        }
      })

      const filtered = res.data.data.filter(survey => 
        !survey.course || survey.course.id === user?.course_id
      )

      setSurveys(filtered)
      setLastPage(res.data.last_page)
    } catch (error) {
      console.error("Failed to fetch surveys:", error)
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSurveys()
  }, [status, page])

  useEffect(() => {
    if (debounceTimer) clearTimeout(debounceTimer)
    const timer = setTimeout(() => {
      setPage(1)
      fetchSurveys()
    }, 500)
    setDebounceTimer(timer)
    return () => clearTimeout(timer)
  }, [searchTerm])

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3 h-auto sm:h-16 py-3">
            
            {/* Title */}
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                <FileText className="w-5 h-5 text-white" />
              </div>
              <h1 className="text-xl font-semibold">Surveys</h1>
            </div>

            {/* Search + Filter */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto sm:items-center">
              <div className="relative w-full sm:w-64">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search surveys"
                  className="pl-10"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <select
                value={status}
                onChange={(e) => { setStatus(e.target.value); setPage(1) }}
                className="border rounded-md px-2 py-1 text-sm w-full sm:w-auto"
              >
                <option value="all">All</option>
                <option value="responded">Responded</option>
                <option value="not_responded">Not Responded</option>
              </select>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {loading ? (
          // Skeleton cards when loading
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {Array.from({ length: 4 }).map((_, i) => (
              <Card key={i} className="h-full">
                <CardHeader className="pb-3">
                  <Skeleton className="w-12 h-12 rounded-lg mb-3" />
                  <Skeleton className="h-5 w-3/4 mb-2" />
                  <Skeleton className="h-4 w-full" />
                </CardHeader>
                <CardContent>
                  <Skeleton className="h-4 w-1/2 mb-2" />
                  <Skeleton className="h-6 w-20 rounded-md" />
                </CardContent>
              </Card>
            ))}
          </div>
        ) : (
          <>
            {searchTerm && surveys.length === 0 && (
              <div className="text-center py-12">
                <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
                <p className="text-gray-500">Try adjusting your search terms.</p>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {surveys.map((survey) => (
                <Link key={survey.id} href={`/alumni/surveys/${survey.id}`}>
                  <Card className="hover:shadow-md transition-shadow cursor-pointer h-full">
                    <CardHeader className="pb-3">
                      <div className="w-12 h-12 bg-gray-500 rounded-lg flex items-center justify-center mb-3">
                        <FileText className="w-6 h-6 text-white" />
                      </div>
                      <CardTitle className="text-lg line-clamp-2">{survey.title}</CardTitle>
                      <CardDescription className="line-clamp-2">
                        {survey.description || "No description"}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="flex items-center justify-between text-sm text-gray-500">
                        <div className="flex items-center space-x-1">
                          <Calendar className="w-4 h-4" />
                          <span>{new Date(survey.created_at).toLocaleDateString()}</span>
                        </div>
                      </div>
                      {!survey.has_responded && (
                        <Badge variant="default" className="bg-blue-500 hover:bg-blue-600">
                          Pending
                        </Badge>
                      )}
                      {survey.course && (
                        <Badge variant="default" className="mt-2">
                          <span className="text-white">{survey.course.name}</span>
                        </Badge>
                      )}
                    </CardContent>
                  </Card>
                </Link>
              ))}
            </div>

            {/* Pagination */}
            {surveys.length > 0 && (
              <div className="flex justify-center space-x-2 mt-8">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage((p) => p - 1)}
                >
                  Prev
                </Button>
                <span className="px-2 py-1 text-sm">
                  Page {page} of {lastPage}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === lastPage}
                  onClick={() => setPage((p) => p + 1)}
                >
                  Next
                </Button>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  )
}
