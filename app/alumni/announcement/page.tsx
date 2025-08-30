"use client"

import { useState, useEffect, useCallback } from "react"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader } from "@/components/ui/card"
import { TrendingUp, Clock, Filter, Search } from "lucide-react"
import AlumniAnnouncementComponent from "@/components/alumni-components/alumni-announcement"
import PostComponents from "@/components/alumni-components/posts-components"
import HeaderAnnouncement from "@/components/admin-components/header-announcement"
import { api2 } from "@/lib/api"
import InfiniteScroll from "@/components/infinite-scroll"
import { Loader2 } from "lucide-react"

export interface User {
  id: string
  first_name: string
  middle_name?: string | null
  last_name: string
  profile_path?: string | null
  full_name?: string
}

export interface ImageType {
  id: number
  announcement_id: number
  image_name: string
  image_file: string
  created_at: string
  updated_at: string
}

export interface Comment {
  id: number | string
  content: string
  timestamp: string
  parent_id?: number | string | null
  user: User
  replies?: Comment[]
  announcement_id: number
  user_id: string
  created_at: string
  updated_at: string
}

export interface Admin {
  id: number
  name: string
  email: string
  profile_path?: string | null
}

export interface Announcement {
  id: number
  title: string
  content: string
  images: ImageType[]
  comments: Comment[]
  admin_id: number
  created_at: string
  updated_at: string
  likes_count?: number
  is_liked?: boolean
  admin: Admin
  comments_count: number //added
}

export default function Page() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState("latest")

  const fetchAnnouncements = useCallback(async (reset = false) => {
    if ((!hasMore && !reset) || loading) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const response = await api2.get<any>(`/api/alumni/announcements-only?page=${currentPage}`)
      
      const newAnnouncements = response.data.data || []
      setAnnouncements(prev => reset ? newAnnouncements : [...prev, ...newAnnouncements])
      setPage(reset ? 2 : prev => prev + 1)
      setHasMore(!!response.data.pagination?.next_page_url)
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])

  useEffect(() => {
    fetchAnnouncements(true)
  }, [activeTab]) // Reset when tab changes

  return (
    <div className="space-y-6">
      {/* Main Content Tabs */}
      <Tabs 
        defaultValue="latest" 
        onValueChange={setActiveTab}
        className="space-y-6"
      >

        {/* Latest Announcements Tab */}
        <TabsContent value="latest" className="space-y-4">
          <div className="rounded-lg">
            <div className="border-b py-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Latest posts from your network</span>
              </div>
            </div>
            <div className="py-4 space-y-6">
              {announcements.length === 0 && !loading ? (
                <p>No announcements found.</p>
              ) : (
                <>
                  {announcements.map((announcement) => (
                    <AlumniAnnouncementComponent 
                      key={announcement.id}
                      announcement={announcement}
                    />
                  ))}
                  
                  <InfiniteScroll
                    hasMore={hasMore}
                    isLoading={loading}
                    next={fetchAnnouncements}
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
        </TabsContent>

        {/* Popular Tab (Placeholder) */}
        <TabsContent value="popular" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Most engaging posts this week</span>
              </div>
            </div>
            <div className="p-4">
              <PostComponents />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}