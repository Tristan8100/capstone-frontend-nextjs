'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
import { Separator } from "@/components/ui/separator"
import { Skeleton } from "@/components/ui/skeleton"

const COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#ec4899'];

export default function AlumniAnalytics() {
  const [data, setData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    api2.get('/api/alumni-user/analytics')
      .then(res => setData(res.data))
      .catch(console.error)
      setLoading(false)
  }, [])

  if (!data) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-4 space-y-4">
      <div>
        <h1 className="text-2xl font-bold">Alumni-List Analytics</h1>
        <p className="text-muted-foreground">Manage alumni list and view analytics</p>
      </div>
      <Separator/>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="border">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium text-primary">Total Alumni</p>
            <p className="text-3xl font-bold">
            {data.batch_distribution.reduce((acc: number, curr: any) => acc + curr.total, 0)}
            </p>
        </CardHeader>
        </Card>

        <Card className="border">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium">Recent Graduates</p>
            <p className="text-3xl font-bold">{data.recent_grads_count}</p>
            <p className="text-xs">Last 2 years</p>
        </CardHeader>
        </Card>

        <Card className="border">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium">Highest number of Alumni Graduates</p>
            <p className="text-3xl font-bold">{data.batch_stats.most_common_batch}</p>
            <p className="text-xs">
            {data.batch_stats.earliest}-{data.batch_stats.latest}
            </p>
        </CardHeader>
        </Card>
      </div>

      {/* Main Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Batch Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={data.batch_distribution}>
                <XAxis dataKey="batch" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="total" fill="#3b82f6" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.course_distribution}
                  dataKey="total"
                  nameKey="course"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.course_distribution.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>

      {/* Bottom Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Status Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {data.status_counts.map((status: any, index: number) => (
                <div key={status.status} className="flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-sm flex-1">{status.status}</span>
                  <span className="font-medium">{status.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Active Alumni Ratio</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.status_counts}
                  dataKey="total"
                  nameKey="status"
                  cx="50%"
                  cy="50%"
                  outerRadius={80}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                >
                  {data.status_counts.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}