"use client"

import { useState, useMemo } from "react"
import Image from "next/image"
import { Heart, MessageCircle, Send, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { api2 } from "@/lib/api"

function getUserDisplayName(user: any) {
  if (user?.full_name) return user.full_name
  const names = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean)
  return names.length ? names.join(" ") : "??"
}

function getUserInitials(user: any) {
  const firstInitial = user?.first_name?.[0] ?? ""
  const middleInitial = user?.middle_name?.[0] ?? ""
  const lastInitial = user?.last_name?.[0] ?? ""
  return [firstInitial, middleInitial, lastInitial].filter(Boolean).join("") || "??"
}

export default function AlumniAnnouncementComponent({ announcement }: any) {
  const {
    id,
    title,
    content,
    images = [],
    created_at,
    likes_count = 0,
    is_liked = false,
    comments_count,
    admin = {},
  } = announcement

  const { user } = useAuth()

  const CURRENT_USER: any = useMemo(
    () =>
      user?.id
        ? {
            id: user.id.toString(),
            first_name: user.name.split(" ")[0] || "",
            last_name: user.name.split(" ").slice(1).join(" ") || "",
            profile_path: user.profile_path,
            full_name: user.name,
          }
        : {
            id: "currentUser",
            first_name: "You",
            last_name: "",
            profile_path: null,
            full_name: "You",
          },
    [user]
  )

  // Likes
  const [currentLikes, setCurrentLikes] = useState(likes_count)
  const [currentIsLiked, setCurrentIsLiked] = useState(!!is_liked)

  const [currentCommentsCount, setCurrentCommentsCount] = useState(
    typeof comments_count === "number"
      ? comments_count
      : (Array.isArray(announcement?.comments) ? announcement.comments.length : 0)
  )

  // Comments (lazy, paginated)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsNextUrl, setCommentsNextUrl] = useState<string | null>(`/api/announcements-only/${id}?page=1`)

  // Compose
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")

  // Replies (per comment pagination)
  const [repliesLoading, setRepliesLoading] = useState<any>({})
  const [repliesNextUrl, setRepliesNextUrl] = useState<any>({})

  // Comments fetch
  const fetchComments = async () => {
    if (!commentsNextUrl || commentsLoading) return
    setCommentsLoading(true)
    try {
      const res = await api2.get<any>(commentsNextUrl)
      const data = res.data?.data ?? []
      setComments(prev => {
        const existing = new Set(prev.map((c: any) => String(c.id)))
        const toAppend = data.filter((c: any) => !existing.has(String(c.id)))
        return [...prev, ...toAppend]
      })
      setCommentsNextUrl(res.data?.pagination?.next_page_url || null)
    } catch (e) {
      console.error("Error fetching comments:", e)
    } finally {
      setCommentsLoading(false)
    }
  }

  // Replies fetch (by comment)
  const fetchReplies = async (commentId: string | number) => {
    const key = String(commentId)
    if (repliesLoading[key]) return
    const nextUrl = repliesNextUrl[key] ?? `/api/announcements-only/replies/${key}?page=1`

    setRepliesLoading((prev: any) => ({ ...prev, [key]: true }))
    try {
      const res = await api2.get<any>(nextUrl)
      const incoming = res.data?.data ?? []

      setComments(prev =>
        prev.map(c => {
          if (String(c.id) !== key) return c
          const currentReplies = Array.isArray(c.replies) ? c.replies : []
          const seen = new Set(currentReplies.map((r: any) => String(r.id)))
          const newOnes = incoming.filter((r: any) => !seen.has(String(r.id)))
          const newCount = Math.max((c.replies_count || 0) - newOnes.length, 0)
          return {
            ...c,
            replies: [...currentReplies, ...newOnes],
            replies_count: newCount,
          }
        })
      )

      const next = res.data?.pagination?.next_page_url || null
      setRepliesNextUrl((prev: any) => ({ ...prev, [key]: next }))
    } catch (e) {
      console.error("Error fetching replies:", e)
    } finally {
      setRepliesLoading((prev: any) => ({ ...prev, [key]: false }))
    }
  }

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim() || !CURRENT_USER.id) return
    try {
      const res = await api2.post<any>("/api/comments", {
        announcement_id: id,
        user_id: CURRENT_USER.id,
        content: newComment,
      })
      const newItem = {
        ...res.data,
        user: CURRENT_USER,
        replies: [],
        replies_count: 0,
      }
      // Prepend newest
      setComments(prev => [newItem, ...prev])
      setNewComment("")
      setCurrentCommentsCount((prev: number) => prev + 1)
    } catch (e) {
      console.error("Failed to add comment:", e)
    }
  }

  // Add reply
  const handleAddReply = async (commentId: string | number) => {
    if (!newReply.trim() || !CURRENT_USER.id) return
    try {
      const res = await api2.post<any>("/api/comments", {
        announcement_id: id,
        user_id: CURRENT_USER.id,
        content: newReply,
        parent_id: commentId,
      })
      const newReplyItem = { ...res.data, user: CURRENT_USER }
      setComments(prev =>
        prev.map(c => {
          if (String(c.id) === String(commentId)) {
            const currentReplies = Array.isArray(c.replies) ? c.replies : []
            const replies_count = typeof c.replies_count === "number" ? c.replies_count : 0
            return {
              ...c,
              replies: [...currentReplies, ...[newReplyItem]],
              replies_count: Math.max(replies_count - 1, 0),
            }
          }
          return c
        })
      )
      setCurrentCommentsCount((prev: number) => prev + 1)
      setNewReply("")
      setReplyingTo(null)
    } catch (e) {
      console.error("Failed to add reply:", e)
    }
  }

  // Like
  const handleLike = async () => {
    try {
      const res = await api2.put<any>(`/api/announcements/${id}/like`)
      setCurrentIsLiked(!!res.data?.is_liked)
      setCurrentLikes(res.data?.likes_count ?? 0)
    } catch (e) {
      console.error("Error toggling like:", e)
    }
  }

  // Toggle comments and load first page once
  const handleToggleComments = () => {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) fetchComments()
  }

  const totalCommentsDisplay = currentCommentsCount

  return (
    <Card className="sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center space-x-3">
          {admin?.profile_path ? (
            <Avatar className="h-10 w-10">
              <Image src={`${admin.profile_path}`} alt={admin?.name || "Admin"} width={600} height={600} />
            </Avatar>
          ) : (
            <Avatar className="h-10 w-10">
              <AvatarFallback>{(admin?.name?.[0] || "A").toUpperCase()}</AvatarFallback>
            </Avatar>
          )}
          <div>
            <h3 className="font-semibold text-sm">{admin?.name || "Admin"}</h3>
            <p className="text-xs text-muted-foreground">{new Date(created_at).toLocaleString()}</p>
          </div>
        </div>
      </CardHeader>

      {/* Content */}
      <CardContent className="px-0 pb-3">
        <div className="flex flex-col lg:flex-row items-center md:items-start gap-6 px-6 pb-4">
          <div className="flex-1 w-full md:w-auto min-w-0">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{content}</p>
          </div>
          {images.length > 0 && (
            <Carousel className="flex-1 w-full lg:w-auto min-w-0">
              <CarouselContent>
                {images.map((img: any, i: number) => (
                  <CarouselItem key={img.id || i}>
                    <div className="relative">
                      <Image
                        src={`${img.image_file}`}
                        alt={img.image_name || `image-${i + 1}`}
                        width={600}
                        height={400}
                        className="w-full h-96 object-cover rounded-md"
                      />
                      <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                        {i + 1} / {images.length}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="left-4" />
              <CarouselNext className="right-4" />
            </Carousel>
          )}
        </div>
      </CardContent>

      {/* Footer */}
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground px-2">
          <span>{totalCommentsDisplay} comments</span>
        </div>

        <Separator />

        <div className="flex items-center justify-around w-full">
          <Button
            variant="ghost"
            size="sm"
            className={`flex-1 hover:bg-muted/50 ${currentIsLiked ? "text-blue-500" : "text-muted-foreground"}`}
            onClick={handleLike}
          >
            <div className="flex items-center">
              <Heart className={`h-4 w-4 mr-1 ${currentIsLiked ? "fill-blue-500" : "fill-none"}`} />
              {currentLikes > 0 && <span className="text-xs ml-1">{currentLikes}</span>}
            </div>
          </Button>

          <Button variant="ghost" size="sm" className="flex-1 hover:bg-muted/50" onClick={handleToggleComments}>
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>

        {showComments && (
          <>
            <Separator />

            {/* Add comment */}
            <div className="w-full space-y-3">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8 relative">
                  {CURRENT_USER.profile_path ? (
                    <Image
                      src={`${CURRENT_USER.profile_path}`}
                      alt={CURRENT_USER.full_name || "Your avatar"}
                      fill
                      style={{ objectFit: "cover", borderRadius: "50%" }}
                      sizes="32px"
                    />
                  ) : (
                    <AvatarFallback>{getUserInitials(CURRENT_USER)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={e => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim() || commentsLoading}>
                      <Send className="h-4 w-4 mr-1" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            <Separator />

            {/* Comments list */}
            <div className="w-full space-y-4">
              {comments
                .filter((c: any) => !c.parent_id)
                .map((comment: any) => {
                  const displayName = getUserDisplayName(comment.user)
                  const initials = getUserInitials(comment.user)
                  const avatarSrc = comment.user?.profile_path ? `${comment.user.profile_path}` : null
                  const key = String(comment.id)
                  const repliesCount = typeof comment.replies_count === "number" ? comment.replies_count : 0
                  const hasMoreReplies = !!repliesNextUrl[key] || repliesCount > 0

                  return (
                    <div key={comment.id} className="space-y-3">
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8 relative">
                          {avatarSrc ? (
                            <Image
                              src={avatarSrc || "/placeholder.svg"}
                              alt={displayName}
                              fill
                              style={{ objectFit: "cover", borderRadius: "50%" }}
                              sizes="32px"
                            />
                          ) : (
                            <AvatarFallback>{initials}</AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <p className="font-semibold text-sm">{displayName}</p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{new Date(comment.created_at).toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs font-medium hover:bg-transparent hover:text-primary"
                              onClick={() => setReplyingTo(replyingTo === key ? null : key)}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Reply input */}
                      {replyingTo === key && (
                        <div className="ml-10 pl-4 flex space-x-3 border-l border-muted-foreground/20">
                          <Avatar className="h-6 w-6">
                            {CURRENT_USER.profile_path ? (
                              <Image
                                src={`${CURRENT_USER.profile_path}`}
                                alt={CURRENT_USER.full_name || "Your avatar"}
                                fill
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                sizes="24px"
                              />
                            ) : (
                              <AvatarFallback className="text-xs">{getUserInitials(CURRENT_USER)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder={`Reply to ${displayName}...`}
                              value={newReply}
                              onChange={e => setNewReply(e.target.value)}
                              className="min-h-[50px] resize-none text-sm"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null)
                                  setNewReply("")
                                }}
                              >
                                Cancel
                              </Button>
                              <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!newReply.trim() || repliesLoading[key]}>
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies list */}
                      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="ml-10 pl-4 space-y-3 border-l border-muted-foreground/20">
                          {comment.replies.map((reply: any) => {
                            const replyName = getUserDisplayName(reply.user)
                            const replyInitials = getUserInitials(reply.user)
                            const replyAvatar = reply.user?.profile_path ? `${reply.user.profile_path}` : null
                            return (
                              <div key={`${reply.id}-${reply.created_at || ""}`} className="flex space-x-3">
                                <Avatar className="h-6 w-6">
                                  {replyAvatar ? (
                                    <Image
                                      src={replyAvatar || "/placeholder.svg"}
                                      alt={replyName}
                                      fill
                                      style={{ objectFit: "cover", borderRadius: "50%" }}
                                      sizes="24px"
                                    />
                                  ) : (
                                    <AvatarFallback className="text-xs">{replyInitials}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="bg-muted rounded-lg px-3 py-2">
                                    <p className="font-semibold text-sm">{replyName}</p>
                                    <p className="text-sm">{reply.content}</p>
                                  </div>
                                  <div className="text-xs text-muted-foreground">
                                    <span>{new Date(reply.created_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}

                      {/* Load more replies */}
                      {hasMoreReplies && (
                        <div className="ml-10 pl-4">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => fetchReplies(comment.id)}
                            disabled={!!repliesLoading[key]}
                          >
                            {repliesLoading[key] ? (
                              <span className="inline-flex items-center">
                                <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                Loading replies...
                              </span>
                            ) : Array.isArray(comment.replies) && comment.replies.length ? (
                              repliesNextUrl[key] ? "Show more replies" : "Replies loaded"
                            ) : (
                              `Show replies (${repliesCount})`
                            )}
                          </Button>
                        </div>
                      )}
                    </div>
                  )
                })}

              {/* Load more comments */}
              {commentsNextUrl && (
                <Button variant="outline" onClick={fetchComments} disabled={commentsLoading} className="w-full">
                  {commentsLoading ? (
                    <span className="inline-flex items-center">
                      <Loader2 className="h-4 w-4 animate-spin mr-2" />
                      Loading...
                    </span>
                  ) : (
                    "Load more comments"
                  )}
                </Button>
              )}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
