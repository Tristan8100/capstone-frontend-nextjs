'use client'

import { useEffect, useState, useCallback } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { api2 } from "@/lib/api"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import InfiniteScroll from "@/components/infinite-scroll"
import { Loader2 } from "lucide-react"

export default function Page() {
  const [status, setStatus] = useState("pending")
  const [posts, setPosts] = useState([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [initialLoad, setInitialLoad] = useState(true)

  const fetchPosts = useCallback(async (status: string, pageNum: number = 1, reset: boolean = false) => {
    if ((!hasMore && !reset) || loading) return
    
    setLoading(true)
    try {
      const response = await api2.get<any>(`/api/my-posts/status/${status}?page=${pageNum}`)
      const newPosts = response.data.data
      
      if (reset) {
        setPosts(newPosts)
        setPage(2) // Next page will be 2 after reset
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }
      
      setHasMore(pageNum < response.data.last_page)
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
    <div className="flex justify-center w-full">
      <Tabs
        value={status}
        onValueChange={setStatus}
        className="w-full max-w-4xl"
      >
        <TabsList className="grid w-full grid-cols-3 rounded-lg shadow-md bg-muted mb-6">
          <TabsTrigger
            value="accepted"
            className="py-2 px-4 text-center rounded-md transition-all duration-200
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
              hover:bg-accent hover:text-accent-foreground"
          >
            Published
          </TabsTrigger>
          <TabsTrigger
            value="pending"
            className="py-2 px-4 text-center rounded-md transition-all duration-200
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
              hover:bg-accent hover:text-accent-foreground"
          >
            Pending
          </TabsTrigger>
          <TabsTrigger
            value="declined"
            className="py-2 px-4 text-center rounded-md transition-all duration-200
              data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
              hover:bg-accent hover:text-accent-foreground"
          >
            Declined
          </TabsTrigger>
        </TabsList>

        {["accepted", "pending", "declined"].map((tab) => (
          <TabsContent key={tab} className="flex justify-center" value={tab}>
            <div className="space-y-4 flex flex-col justify-center items-center"> {/* NOTICE IF w-full BECOMES NOT ALIGNED */}
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {tab} Posts
              </h2>
              
              {status === tab && (
                <>
                  {posts.length === 0 && !initialLoad ? (
                    <p className="text-center text-muted-foreground">No posts available.</p>
                  ) : (
                    <>
                      {posts.map((post) => (
                        <PostComponentsAlumni 
                          status={status} 
                          is_liked={post.is_liked} 
                          isAdmin={false} 
                          key={post.id} 
                          post={post} 
                        />
                      ))}
                      
                      <InfiniteScroll
                        hasMore={hasMore}
                        isLoading={loading}
                        next={() => fetchPosts(status, page)}
                        threshold={0.8}
                      >
                        {hasMore && (
                          <div className="flex justify-center p-4 w-full">
                            <Loader2 className="h-6 w-6 animate-spin" />
                          </div>
                        )}
                      </InfiniteScroll>
                    </>
                  )}
                </>
              )}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}