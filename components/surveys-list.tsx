"use client"

import { useState } from "react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MoreVertical, Plus, Search, FileText, Users, Calendar } from "lucide-react"
import { Input } from "@/components/ui/input"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"

// Mock data for surveys
const surveys = [
  {
    id: 1,
    title: "Customer Satisfaction Survey",
    description: "Help us improve our services by sharing your feedback",
    responses: 127,
    status: "Active",
    createdAt: "2024-01-15",
    color: "bg-blue-500",
  },
  {
    id: 2,
    title: "Employee Engagement Survey",
    description: "Annual survey to measure employee satisfaction and engagement levels",
    responses: 45,
    status: "Active",
    createdAt: "2024-01-10",
    color: "bg-green-500",
  },
  {
    id: 3,
    title: "Product Feedback Form",
    description: "Share your thoughts on our latest product features",
    responses: 89,
    status: "Draft",
    createdAt: "2024-01-08",
    color: "bg-purple-500",
  },
  {
    id: 4,
    title: "Event Registration",
    description: "Register for our upcoming annual conference",
    responses: 234,
    status: "Closed",
    createdAt: "2024-01-05",
    color: "bg-orange-500",
  },
  {
    id: 5,
    title: "Market Research Survey",
    description: "Help us understand market trends and customer preferences",
    responses: 67,
    status: "Active",
    createdAt: "2024-01-03",
    color: "bg-red-500",
  },
  {
    id: 6,
    title: "Website Usability Test",
    description: "Evaluate the user experience of our new website design",
    responses: 23,
    status: "Draft",
    createdAt: "2024-01-01",
    color: "bg-teal-500",
  },
]

export default function SurveysList() {
  const [searchTerm, setSearchTerm] = useState("")

  // Filter surveys based on search term
  const filteredSurveys = surveys.filter( //will change to the fetch data on actual implementation
    (survey) =>
      survey.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      survey.status.toLowerCase().includes(searchTerm.toLowerCase()),
  )

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
                <h1 className="text-xl font-semibold">Forms</h1>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                <Input
                  placeholder="Search forms"
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
        {/* Action Bar */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">Recent forms</h2>
            <p className="text-gray-600 mt-1">
              {searchTerm ? `${filteredSurveys.length} result(s) for "${searchTerm}"` : "Manage and view your surveys"}
            </p>
          </div>
          <Button className="flex items-center space-x-2">
            <Plus className="w-4 h-4" />
            <span>Create Form</span>
          </Button>
        </div>

        {/* No Results Message */}
        {searchTerm && filteredSurveys.length === 0 && (
          <div className="text-center py-12">
            <Search className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No forms found</h3>
            <p className="text-gray-500">Try adjusting your search terms or create a new form.</p>
          </div>
        )}

        {/* Surveys Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredSurveys.map((survey) => (
            <Card key={survey.id} className="hover:shadow-md transition-shadow cursor-pointer">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className={`w-12 h-12 ${survey.color} rounded-lg flex items-center justify-center mb-3`}>
                    <FileText className="w-6 h-6 text-white" />
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="w-8 h-8">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Share</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
                <CardTitle className="text-lg line-clamp-2">{survey.title}</CardTitle>
                <CardDescription className="line-clamp-2">{survey.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4 text-sm text-gray-500">
                    <div className="flex items-center space-x-1">
                      <Users className="w-4 h-4" />
                      <span>{survey.responses}</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Calendar className="w-4 h-4" />
                      <span>{survey.createdAt}</span>
                    </div>
                  </div>
                  <Badge
                    variant={
                      survey.status === "Active" ? "default" : survey.status === "Draft" ? "secondary" : "outline"
                    }
                  >
                    {survey.status}
                  </Badge>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
}
