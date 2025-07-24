'use client'

import { useEffect, useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"
import { api2 } from "@/lib/api"
import PostComponentsAlumni from "@/components/alumni-components/alumni-post-components"

export default function Page() {
  const [status, setStatus] = useState("pending")
  const [posts, setPosts] = useState([])

  useEffect(() => {
    fetchPosts(status)
  }, [status])

  const fetchPosts = async (status: string) => {
    try {
      const response = await api2.get<any>(`/api/my-posts/status/${status}`)
      setPosts(response.data)
    } catch (err) {
      console.error("Error fetching posts:", err)
    }
  }

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
            <div className="space-y-4 flex flex-col justify-center items-center">
                <h2 className="text-xl font-semibold text-foreground capitalize">
                {tab} Posts
                </h2>
                <p className="text-muted-foreground">
                Content for {tab} posts goes here.
                </p>
                {posts.length === 0 ? (
                <p className="text-center text-muted-foreground">No posts available.</p>
                ) : (
                posts.map((post: any) => (
                    <PostComponentsAlumni status={status} isAdmin={false} key={post.id} post={post} />
                ))
                )}
            </div>
            </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
