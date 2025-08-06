'use client'

import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Search, FileText, Calendar } from "lucide-react"
import { Badge } from "@/components/ui/badge"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"

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
export default function SurveysListUser() {
  const [surveys, setSurveys] = useState<Survey[]>([])
  const [searchTerm, setSearchTerm] = useState("")
  const { user } = useAuth()

  useEffect(() => {
    const fetchSurveys = async () => {
      try {
        const response = await api2.get<Survey[]>("/api/surveys")
        setSurveys(response.data)
      } catch (error) {
        console.error("Failed to fetch surveys:", error)
      }
    }

    fetchSurveys()
  }, [])

  const filteredSurveys = surveys.filter(survey => {
    const matchesSearch = survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (survey.description?.toLowerCase() || "").includes(searchTerm.toLowerCase())
    
    //NEW MODIFIED: Add course validation
    const hasAccess = !survey.course || survey.course.id === user?.course_id
    
    return matchesSearch && hasAccess
  })

  return (
    <div className="min-h-screen w-full">
      {/* Header */}
      <div className="border-b">
        <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-purple-600 rounded-lg flex items-center justify-center">
                  <FileText className="w-5 h-5 text-white" />
                </div>
                <h1 className="text-xl font-semibold">Surveys</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search surveys"
                  className="pl-10 w-64"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="mb-8">
          <h2 className="text-2xl font-bold text-gray-900">Available Surveys</h2>
          <p className="text-gray-600 mt-1">
            {searchTerm
              ? `${filteredSurveys.length} result(s) for "${searchTerm}"`
              : "Participate in surveys relevant to you"}
          </p>
        </div>

        {/* No Results */}
        {searchTerm && filteredSurveys.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No surveys found</h3>
            <p className="text-gray-500">Try adjusting your search terms.</p>
          </div>
        )}

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSurveys.map((survey) => (
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
      </div>
    </div>
  )
}
