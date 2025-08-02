'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { BarChart, Bar, XAxis, YAxis, ResponsiveContainer, Tooltip, PieChart, Pie, Cell } from "recharts"
import { useEffect, useState } from "react"
import { api2 } from "@/lib/api"
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

  if (loading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Batch Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-80">
            <Skeleton className="h-full w-full" />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!data) return <div>No data available</div>

  return (
    <div className="space-y-6">

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border border-primary/20">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium text-primary">Total Alumni</p>
            <p className="text-3xl font-bold">
            {data.batch_distribution.reduce((acc: number, curr: any) => acc + curr.total, 0)}
            </p>
        </CardHeader>
        </Card>

        <Card className="bg-emerald-500/10 border border-emerald-500/20">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium text-emerald-500">Recent Graduates</p>
            <p className="text-3xl font-bold">{data.recent_grads_count}</p>
            <p className="text-xs text-emerald-500/80">Last 5 years</p>
        </CardHeader>
        </Card>

        <Card className="bg-amber-500/10 border border-amber-500/20">
        <CardHeader className="pb-2">
            <p className="text-sm font-medium text-amber-500">Avg. Batch Year</p>
            <p className="text-3xl font-bold">{data.batch_stats.average}</p>
            <p className="text-xs text-amber-500/80">
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
            <CardTitle>Common Last Names</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {data.common_last_names.map((name: any, index: number) => (
                <div 
                  key={name.last_name}
                  className="flex items-center px-3 py-1 rounded-full text-sm"
                  style={{ 
                    backgroundColor: `${COLORS[index % COLORS.length]}20`,
                    border: `1px solid ${COLORS[index % COLORS.length]}`
                  }}
                >
                  <span>{name.last_name}</span>
                  <span className="ml-1.5 font-medium">{name.total}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}