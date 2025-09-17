"use client"

import { useState, useEffect, useCallback } from "react"
import CreateAnnouncement from "@/components/admin-components/create-announcement"
import AdminAnnouncementComponent from "@/components/admin-components/admin-announcement"
import { Input } from "@/components/ui/input"
import { Card, CardHeader } from "@/components/ui/card"
import { Filter, Search } from "lucide-react"
import HeaderAnnouncement from "@/components/admin-components/header-announcement"
import { api2 } from "@/lib/api"
import InfiniteScroll from "@/components/infinite-scroll"
import { Loader2 } from "lucide-react"
import { Clock } from "lucide-react"
import HeaderCommunity from "@/components/admin-components/header-community"

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
}

export default function Page() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])
  const [page, setPage] = useState(1)
  const [hasMore, setHasMore] = useState(true)
  const [loading, setLoading] = useState(false)

  const fetchAnnouncements = useCallback(async (reset = false) => {
    console.log("Fetching announcements...")
    if ((!hasMore && !reset) || loading) return
    
    setLoading(true)
    try {
      const currentPage = reset ? 1 : page
      const response = await api2.get<any>(`/api/announcements?page=${currentPage}`)
      
      const newAnnouncements = response.data.data || []
      setAnnouncements(prev => reset ? newAnnouncements : [...prev, ...newAnnouncements])
      setPage(reset ? 2 : prev => prev + 1)
      setPage(prev => reset ? 2 : prev + 1)
      setHasMore(!!response.data.pagination?.next_page_url)
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    } finally {
      setLoading(false)
    }
  }, [page, hasMore, loading])


  const handleRefresh = useCallback(() => {
    console.log("Refreshing announcements...")
    fetchAnnouncements(true)
    console.log("Announcements refreshed.")
  }, [fetchAnnouncements])

  useEffect(() => {
    fetchAnnouncements(true)
  }, [])

  return (
    <div className="space-y-6">
      <div className="p-4 space-y-6">
        <HeaderCommunity currentPage="Community Posts" text='View and manage announcements' />
        <CreateAnnouncement onSuccess1={handleRefresh} />
      </div>

      <div>
        <div className="space-y-6">
          {announcements.length === 0 && !loading ? (
            <p>No announcements found.</p>
          ) : (
            <>
              {announcements.map((announcement) => (
                <AdminAnnouncementComponent
                  key={`announcement-${announcement.id}`}
                  announcement={announcement}
                  onDeleteSuccess={handleRefresh}
                  onUpdateSuccess={handleRefresh}
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
    </div>
  )
}