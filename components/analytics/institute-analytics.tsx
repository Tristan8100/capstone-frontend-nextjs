'use client'
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip } from "recharts"
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import Image from "next/image"

export default function InstituteAnalytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await api2.get("/api/institute/analytics")
        setStats(response.data)
      } catch (error) {
        console.error("Error fetching data:", error)
      }
    }
    fetchData()
  }, [])

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Institute Analytics</h1>

      {/* Top Institutes */}
      <Card>
        <CardHeader>
          <CardTitle>Top Institutes by Course Offerings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
            {stats.institute_stats?.map((institute: any) => (
              <div key={institute.institute} className="text-center">
                {institute.image && (
                  <div className="mx-auto mb-2 relative w-16 h-16">
                    <Image
                      src={institute.image}
                      alt={institute.institute}
                      fill
                      className="rounded-full object-cover"
                    />
                  </div>
                )}
                <h3 className="font-medium">{institute.institute}</h3>
                <p className="text-sm text-muted-foreground">
                  {institute.course_count} courses
                </p>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Course Distribution */}
      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Total Institutes</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.course_distribution?.total_institutes}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Total Courses</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.course_distribution?.total_courses}</p>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Avg Courses/Institute</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold">{stats.course_distribution?.avg_courses_per_institute}</p>
          </CardContent>
        </Card>
      </div>

      {/* Active Institutes */}
      <Card>
        <CardHeader>
          <CardTitle>Most Active Institutes</CardTitle>
          <p className="text-sm text-muted-foreground">By alumni enrollment</p>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <BarChart data={stats.active_institutes}>
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Bar 
                dataKey="active_courses" 
                name="Courses with Alumni"
                fill="#8884d8" 
              />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  )
}