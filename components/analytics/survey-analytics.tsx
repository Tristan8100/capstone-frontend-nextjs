'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

export default function SurveyAnalytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    api2.get("/api/survey/analytics").then(res => setStats(res.data))
  }, [])

  if (!stats) return 
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading dashboard...</p>
      </div>

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Survey Analytics</h1>
        <p className="text-muted-foreground">Manage responses and edit surveys</p>
      </div>
      <Separator/>

      {/* Survey data */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="border">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-primary">Total Surveys</p>
            <p className="text-3xl font-bold">{stats.survey_counts?.total_surveys}</p>
          </CardHeader>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Active Surveys</p>
            <p className="text-3xl font-bold">{stats.survey_counts?.active_surveys}</p>
            <p className="text-xs">With questions</p>
          </CardHeader>
        </Card>

        <Card className="border">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium">Draft Surveys</p>
            <p className="text-3xl font-bold">{stats.survey_counts?.draft_surveys}</p>
            <p className="text-xs">No questions yet</p>
          </CardHeader>
        </Card>
      </div>

      {/* Response Overview */}
      <Card>
        <CardHeader>
          <CardTitle>Response Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Total Responses</p>
              <p className="text-2xl font-bold">{stats.response_overview?.total_responses}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Last 7 Days</p>
              <p className="text-2xl font-bold">{stats.response_overview?.responses_last_week}</p>
            </div>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">Unique Respondents</p>
              <p className="text-2xl font-bold">{stats.response_overview?.unique_respondents}</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Recent Activity */}
      <Card>
        <CardHeader>
          <CardTitle>Recently Updated Surveys</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {stats.recent_activity?.map((survey: any) => (
              <div key={survey.id} className="flex items-center justify-between p-2 border rounded-lg">
                <div>
                  <h3 className="font-medium">{survey.title}</h3>
                  <p className="text-sm text-muted-foreground">
                    {survey.question_count} questions • {survey.response_count} responses
                  </p>
                </div>
                <div className="flex items-center space-x-4">
                  <p className="text-sm text-muted-foreground">
                    Updated {survey.last_updated}
                  </p>
                  <Link href={`/admin/surveys/${survey.id}`}>
                    <Button variant="outline" size="sm">
                      Manage
                    </Button>
                  </Link>
                  <Link href={`/admin/surveys/responses/${survey.id}`}>
                    <Button variant="outline" size="sm">
                      Response
                    </Button>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}