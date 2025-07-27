"use client"

import { useEffect, useState } from "react"
import { Card, CardHeader } from "@/components/ui/card"
import { Filter, Search } from "lucide-react"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"
import HeaderCommunity from "@/components/admin-components/header-community"
import { api2 } from "@/lib/api"
import { Input } from "@/components/ui/input"

export default function Page() {
  const [posts, setPosts] = useState<any[]>([])
  const [status, setStatus] = useState("accepted")

  useEffect(() => {
    fetchPosts(status)
  }, [status])

  const fetchPosts = async (search: string) => {
    try {
      // CHANGE THE STATUS
      const response = await api2.get<any>(
        `/api/posts/status/${search}`
      )
      setPosts(response.data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    }
  }

  return (
    <div className="space-y-6">
      <HeaderCommunity currentPage="Community Posts" />

      {/* Posts list */}
      <div className="space-y-4 max-w-4xl mx-auto">
        {posts.length === 0 ? (
          <p className="text-center text-muted-foreground">No posts found.</p>
        ) : (
          posts.map((post) => (
            <PostComponentsAlumni status={status} is_liked={post.is_liked} isAdmin={true} key={post.id} post={post} />
          ))
        )}
      </div>
    </div>
  )
}
