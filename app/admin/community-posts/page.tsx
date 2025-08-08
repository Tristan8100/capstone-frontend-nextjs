"use client"

import { useEffect, useState, useCallback } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { Filter, Search } from "lucide-react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import HeaderCommunity from "@/components/admin-components/header-community"
import { api2 } from "@/lib/api"
import { Input } from "@/components/ui/input"
import InfiniteScroll from "@/components/infinite-scroll"
import { Loader2 } from "lucide-react"

export default function Page() {
  const [posts, setPosts] = useState([])
  const [status, setStatus] = useState("accepted")
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

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
    }
  }, [hasMore, loading])

  useEffect(() => {
    setPosts([])
    setPage(1)
    setHasMore(true)
    fetchPosts(status, 1, true)
  }, [status])


  return (
    <div className="space-y-6">
      <HeaderCommunity currentPage="Community Posts" text="View and manage community posts"/>

      {/* Posts list with infinite scroll */}
      <div className="space-y-4 mx-auto">
        {posts.length === 0 && !loading ? (
          <p className="text-center text-muted-foreground">No posts found.</p>
        ) : (
          <>
            {posts.map((post) => (
              <PostComponentsAlumni 
                status={status} 
                is_liked={post.is_liked} 
                isAdmin={true} 
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
                <div className="flex justify-center p-4">
                  <Loader2 className="h-6 w-6 animate-spin" />
                </div>
              )}
            </InfiniteScroll>
          </>
        )}
      </div>
    </div>
  )
}