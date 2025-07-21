"use client"

import { useState, useEffect, useCallback } from "react"
import CreateAnnouncement from "@/components/admin-components/create-announcement"
import AdminAnnouncementComponent from "@/components/admin-components/admin-announcement" // This component will import types from here
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader } from "@/components/ui/card"
import { TrendingUp, Clock, Filter, Search } from "lucide-react"
import PostComponents from "@/components/alumni-components/posts-components"
import HeaderAnnouncement from "@/components/admin-components/header-announcement"
import { api2 } from "@/lib/api"

// --- Type Definitions (all in this single file, exported for other components) ---
export interface User {
  id: string // Ensure this is string
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
  id: number | string // Can be number from backend or string from client-side generation
  content: string
  timestamp: string // For display, derived from created_at
  parent_id?: number | string | null // Can be number from backend or string from client-side generation
  user: User
  replies?: Comment[]
  announcement_id: number // For backend payload
  user_id: string // For backend payload
  created_at: string // From backend
  updated_at: string // From backend
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
}

export interface AnnouncementProps {
  id: number
  title: string
  content: string
  images: ImageType[]
  comments: Comment[]
  admin_id: number
  created_at: string
  updated_at: string
  onDeleteSuccess: () => void
  onUpdateSuccess: () => void
}

// --- Main Page Component ---
export default function Page() {
  const [announcements, setAnnouncements] = useState<Announcement[]>([])

  const fetchAnnouncements = useCallback(async () => {
    try {
      const response = await api2.get<Announcement[]>("/api/announcements")
      setAnnouncements(response.data)
    } catch (error) {
      console.error("Failed to fetch announcements:", error)
    }
  }, [])

  useEffect(() => {
    fetchAnnouncements()
  }, [fetchAnnouncements])

  const handleAnnouncementDeleted = () => {
    fetchAnnouncements()
  };

  const handleAnnouncementUpdated = () => {
    fetchAnnouncements()
  };

  return (
    <div className="space-y-6">
      <HeaderAnnouncement />
      <CreateAnnouncement />
      {/* Filters and Search */}
      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
            <div className="flex items-center gap-2">
              <Filter className="h-4 w-4 text-muted-foreground" />
              <span className="text-sm font-medium">Filter Posts</span>
            </div>
            <div className="flex flex-col gap-2 md:flex-row md:items-center">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input placeholder="Search posts..." className="pl-9 md:w-64" />
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>
      {/* Main Content Tabs */}
      <Tabs defaultValue="latest" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular
            </TabsTrigger>
          </TabsList>
          <div className="flex items-center gap-2 text-sm text-muted-foreground">
            <div className="h-2 w-2 rounded-full bg-green-500"></div>
            <span>Live updates</span>
          </div>
        </div>
        <TabsContent value="latest" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Latest posts from your network</span>
              </div>
            </div>
            <div className="p-4 space-y-6">
              {announcements.length === 0 ? (
                <p>No announcements found.</p>
              ) : (
                announcements.map((announcement) => (
                  <AdminAnnouncementComponent
                    key={announcement.id}
                    id={announcement.id}
                    title={announcement.title}
                    content={announcement.content}
                    images={announcement.images}
                    comments={announcement.comments}
                    admin_id={announcement.admin_id}
                    created_at={announcement.created_at}
                    updated_at={announcement.updated_at}
                    onDeleteSuccess={handleAnnouncementDeleted}
                    onUpdateSuccess={handleAnnouncementUpdated}
                  />
                ))
              )}
            </div>
          </div>
        </TabsContent>
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
