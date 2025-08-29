"use client"

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

  const fetchPosts = useCallback(async (status: string, pageNum: number = 1, reset: boolean = false) => {
    // Return early if we are already loading
    if (loading) return
    
    // Set loading to true immediately to show the spinner
    setLoading(true)
    
    try {
      const response = await api2.get<any>(`/api/my-posts/status/${status}?page=${pageNum}`)
      const newPosts = response.data.data
      
      if (reset) {
        setPosts(newPosts)
        setPage(2)
      } else {
        setPosts(prev => [...prev, ...newPosts])
        setPage(prev => prev + 1)
      }
      
      setHasMore(pageNum < response.data.last_page)
    } catch (err) {
      console.error("Error fetching posts:", err)
      setHasMore(false)
    } finally {
      // Set loading to false once the fetch is complete
      setLoading(false)
    }
  }, [loading])

  // Handle tab change
  const handleTabChange = useCallback((newStatus: string) => {
    setStatus(newStatus)
    setPosts([]) // Clear posts immediately
    setPage(1)
    setHasMore(true)
    // The fetch will be triggered by the new status in useEffect
  }, [])

  useEffect(() => {
    fetchPosts(status, 1, true)
  }, [status])


  const handlePostDeleted = useCallback((postId) => {
    setPosts(prevPosts => prevPosts.filter(post => post.id !== postId));
  }, []);

  return (
    <div className="flex justify-center w-full">
      <Tabs
        value={status}
        onValueChange={handleTabChange}
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
            <div className="space-y-4 flex flex-col justify-center items-center">
              <h2 className="text-xl font-semibold text-foreground capitalize">
                {tab} Posts
              </h2>
              
              {loading && posts.length === 0 ? (
                <div className="flex justify-center p-4">
                  <Loader2 className="h-8 w-8 animate-spin" />
                </div>
              ) : posts.length === 0 ? (
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
                      onPostDeleted={handlePostDeleted}
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
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}