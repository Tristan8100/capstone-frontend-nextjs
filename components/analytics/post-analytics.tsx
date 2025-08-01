'use client'

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import { api2 } from "@/lib/api"
import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"

export default function PostAnalytics() {
  const [stats, setStats] = useState<any>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      const response = await api2.get("/api/post/analytics")
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
      <h1 className="text-3xl font-bold">Admin Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle>Pending Posts</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-4xl font-bold">{stats.pending_posts_count}</p>
            <p className="text-sm text-muted-foreground">
              {stats.pending_ratio?.toFixed(1)}% of total posts
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Top Poster</CardTitle>
          </CardHeader>
          <CardContent>
            {stats.top_users?.length > 0 && (
              <>
                <p className="text-2xl font-bold">
                  {stats.top_users[0].first_name} {stats.top_users[0].last_name}
                </p>
                <p className="text-sm text-muted-foreground">
                  {stats.top_users[0].posts_count} posts
                </p>
              </>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Common Words</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {Object.entries(stats.common_words || {})
                .slice(0, 5)
                .map(([word, count]) => (
                  <span key={word} className="bg-secondary px-2 py-1 rounded text-sm">
                    {word} ({String(count)})
                  </span>
                ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Posts Trend Chart */}
      <Card>
        <CardHeader>
          <CardTitle>Posts Over Time</CardTitle>
        </CardHeader>
        <CardContent className="h-[300px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={stats.posts_trend || []}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="total" fill="#8884d8" />
            </BarChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>

      {/* Top Users Table */}
      <Card>
        <CardHeader>
          <CardTitle>Top Users</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="text-center">Profile</TableHead>
                <TableHead className="text-center">User</TableHead>
                <TableHead className="text-center">Posts</TableHead>
                <TableHead className="text-center">Actions</TableHead>
              </TableRow>
            </TableHeader>
           <TableBody>
            {(stats.top_users || []).map((user: any) => (
                <TableRow key={user.id}>
                <TableCell className="text-center align-middle">
                    <div className="flex justify-center">
                    {user.profile_path ? (
                        <Image
                        src={user.profile_path}
                        alt={`${user.first_name} ${user.last_name}`}
                        width={32}
                        height={32}
                        className="rounded-full"
                        />
                    ) : (
                        <div className="w-8 h-8 rounded-full bg-gray-200 flex items-center justify-center mx-auto">
                        <span className="text-sm font-medium text-gray-600">
                            {user.first_name?.[0]}{user.last_name?.[0]}
                        </span>
                        </div>
                    )}
                    </div>
                </TableCell>
                <TableCell className="text-center align-middle">
                    {user.first_name} {user.last_name}
                </TableCell>
                <TableCell className="text-center align-middle">
                    {user.posts_count}
                </TableCell>
                <TableCell className="text-center align-middle">
                    <Link href={`/admin/view/${user.id}`} passHref>
                    <Button variant="outline" size="sm" className="h-8">
                        View
                    </Button>
                    </Link>
                </TableCell>
                </TableRow>
            ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  )
}