'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell, Legend } from 'recharts'
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

// Color palette for the pie chart
const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884d8', '#82ca9d'];

export default function AccountAnalytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api2.get("/api/alumni-account/analytics")
      setStats(response.data)
    } catch (error) {
      console.error("Error fetching data:", error)
    }
  }

  if (!stats) {
    return (
      <div className="flex items-center justify-center min-h-[60vh]">
        <p>Loading dashboard...</p>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 space-y-8">
      <h1 className="text-3xl font-bold">Alumni Analytics</h1>

      {/* Stats Cards - Same as before */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-primary/10 border border-primary/20">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-primary">Total Alumni</p>
            <p className="text-3xl font-bold">{stats.total_users}</p>
            <p className="text-xs text-primary/80">Registered in system</p>
          </CardHeader>
        </Card>

        <Card className="bg-emerald-500/10 border border-emerald-500/20">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-emerald-500">Most Popular Course</p>
            {stats.course_distribution?.length > 0 && (
              <>
                <p className="text-3xl font-bold">
                  {stats.course_distribution[0].course}
                </p>
                <p className="text-xs text-emerald-500/80">
                  {stats.course_distribution[0].user_count} alumni
                </p>
              </>
            )}
          </CardHeader>
        </Card>

        <Card className="bg-amber-500/10 border border-amber-500/20">
          <CardHeader className="pb-2">
            <p className="text-sm font-medium text-amber-500">Recent Registrations</p>
            <p className="text-3xl font-bold">
              {stats.created_at_trend?.slice(-1)[0]?.total || 0}
            </p>
            <p className="text-xs text-amber-500/80">
              Last registration on {stats.created_at_trend?.slice(-1)[0]?.date}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Registration Trend Chart - Same as before */}
      <Card>
        <CardHeader>
          <CardTitle>Registration Trend</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.created_at_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Updated Course Distribution with Pie Chart */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <Card>
          <CardHeader>
            <CardTitle>Course Distribution</CardTitle>
          </CardHeader>
          <CardContent className="h-[400px]">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={stats.course_distribution || []}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  outerRadius={120}
                  fill="#8884d8"
                  dataKey="user_count"
                  nameKey="course"
                  label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                >
                  {stats.course_distribution?.map((entry: any, index: number) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => [`${value} alumni`, 'Count']}
                />
                <Legend />
              </PieChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Course Details</CardTitle>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Course</TableHead>
                  <TableHead className="text-right">Alumni</TableHead>
                  <TableHead className="text-right">Percentage</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {(stats.course_distribution || []).map((course: any) => (
                  <TableRow key={course.course}>
                    <TableCell>{course.course}</TableCell>
                    <TableCell className="text-right">{course.user_count}</TableCell>
                    <TableCell className="text-right">
                      {((course.user_count / stats.total_users) * 100).toFixed(1)}%
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}