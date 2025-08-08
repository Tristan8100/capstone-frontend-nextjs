"use client"

import { useEffect, useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, XCircle, CheckCircle } from "lucide-react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import HeaderCommunity from "@/components/admin-components/header-community"
import { api2 } from "@/lib/api"
import InfiniteScroll from "@/components/infinite-scroll"
import { Loader2 } from "lucide-react"

interface Post {
  id: number
  is_liked: boolean
  // add 
}

export default function Page() {
  const [status, setStatus] = useState("pending")
  const [posts, setPosts] = useState<Post[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const fetchPosts = useCallback(async (status: string, pageNum: number = 1, reset: boolean = false) => {
    if ((!hasMore && !reset) || loading) return
    
    setLoading(true)
    try {
      const response = await api2.get<any>(`/api/posts-only/status/${status}?page=${pageNum}`)
      const newPosts = response.data.data
      
      if (reset) {
        setPosts(newPosts)
        setPage(2) // Next page will be 2 after reset
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }
      
      setHasMore(!!response.data.next_page_url)
    } catch (err) {
      console.error("Error fetching posts:", err)
    } finally {
      setLoading(false)
      if (initialLoad) setInitialLoad(false)
    }
  }, [hasMore, loading, initialLoad])

  // Handle tab change
  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    fetchPosts(status, 1, true)
  }, [status])

  return (
    <div className="space-y-6 pb-10">
      <HeaderCommunity currentPage="Pending Posts" text="View and manage pending posts"/>

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
              <div className="space-y-4">
                {status === type && (
                  <>
                    {posts.length === 0 && !initialLoad ? (
                      <p className="text-center text-muted-foreground">No posts available.</p>
                    ) : (
                      <>
                        {posts.map((post) => (
                          <PostComponentsAlumni
                            status={status}
                            key={post.id}
                            post={post}
                            is_liked={post.is_liked}
                            isAdmin={true}
                          />
                        ))}
                        
                        <InfiniteScroll
                          hasMore={hasMore}
                          isLoading={loading}
                          next={() => fetchPosts(status, page)}
                          threshold={0.8}
                        >
                          {hasMore && (
                            <div className="flex justify-center p-4">
                              <Loader2 className="h-6 w-6 animate-spin" />
                            </div>
                          )}
                        </InfiniteScroll>
                      </>
                    )}
                  </>
                )}
              </div>
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}