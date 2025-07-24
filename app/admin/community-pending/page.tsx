"use client"

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import HeaderCommunity from "@/components/admin-components/header-community"
import { api2 } from "@/lib/api"

export default function Page() {
  const [status, setStatus] = useState("pending")
  const [posts, setPosts] = useState<any[]>([])

  useEffect(() => {
    fetchPosts(status)
  }, [status])

  const fetchPosts = async (status: string) => {
    try {
      const response = await api2.get<any>(`/api/posts/status/${status}`)
      setPosts(response.data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    }
  }

  return (
    <div className="space-y-6 pb-10"> {/* Add bottom padding to un-crowd */}
      <HeaderCommunity currentPage="Pending Posts" />

      <Tabs value={status} onValueChange={setStatus} className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-3">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="declined" className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Declined
            </TabsTrigger>
            <TabsTrigger value="accepted" className="flex items-center gap-2">
              <CheckCircle className="h-4 w-4 text-green-500" />
              Accepted
            </TabsTrigger>
          </TabsList>
        </div>

        {["pending", "declined", "accepted"].map((type) => (
          <TabsContent key={type} value={type} className="space-y-4">
            <div className="rounded-lg border bg-card">
              <div className="border-b p-4">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  {type === "pending" && <Clock className="h-4 w-4" />}
                  {type === "declined" && <XCircle className="h-4 w-4 text-red-500" />}
                  {type === "accepted" && <CheckCircle className="h-4 w-4 text-green-500" />}
                  <span className="capitalize">{type} posts</span>
                </div>
              </div>
              <div className="space-y-4"> {/* Add space between posts */}
                {posts.length === 0 ? (
                  <p className="text-center text-muted-foreground">No posts available.</p>
                ) : (
                  posts.map((post: any) => (
                    <PostComponentsAlumni
                      status={status}
                      key={post.id}
                      post={post}
                      isAdmin={true} // Only true for pending
                    />
                  ))
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
