"use client"

import { useMemo, useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreHorizontal, Send, Edit, Trash2, Loader2 } from 'lucide-react'
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog"
import { useAuth } from "@/contexts/AuthContext"
import { api2 } from "@/lib/api"
import { Input } from "../ui/input"
import { toast } from "sonner" // Import toast from sonner

function getUserDisplayName(user: any) {
  if (user?.full_name) return user.full_name
  const names = [user?.first_name, user?.middle_name, user?.last_name].filter(Boolean)
  return names.length ? names.join(" ") : "??"
}
function getUserInitials(user: any) {
  const firstInitial = user?.first_name?.[0] ?? ""
  const middleInitial = user?.middle_name?.[0] ?? ""
  const lastInitial = user?.last_name?.[0] ?? ""
  const initials = [firstInitial, middleInitial, lastInitial].filter(Boolean).join("")
  return initials || "??"
}

export default function AdminAnnouncementComponent({
  announcement,
  onUpdateSuccess = () => {},
  onDeleteSuccess = () => {},
  isAdmin = true, // Add isAdmin prop, nah nonesense now, just separated alumni to not be a mess
}: any) {
  const {
    id,
    title,
    content,
    images = [],
    comments: initialComments = [],
    created_at,
    likes_count = 0,
    is_liked = false,
    comments_count,
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

  // UI state: edit/delete
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [titleEdit, setTitleEdit] = useState(title)
  const [editedContent, setEditedContent] = useState(content)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  // Likes and comments count display (count is local so we can increment on new comment)
  const [currentLikes] = useState(likes_count)
  const [currentCommentsCount, setCurrentCommentsCount] = useState(
    typeof comments_count === "number"
      ? comments_count
      : (Array.isArray(initialComments) ? initialComments.length : 0)
  )

  // Comment/reply compose
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")

  // Lazy comments pagination
  const [comments, setComments] = useState<any[]>([])
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [commentsNextUrl, setCommentsNextUrl] = useState<string | null>(
    `/api/announcements-only/${id}?page=1`
  )

  // Per-comment replies pagination
  const [repliesLoading, setRepliesLoading] = useState<any>({})
  const [repliesNextUrl, setRepliesNextUrl] = useState<any>({})

  // Fetch comments
  const fetchComments = async () => {
    if (!commentsNextUrl || commentsLoading) return
    setCommentsLoading(true)
    try {
      const res = await api2.get<any>(commentsNextUrl)
      const data = res.data?.data ?? []
      // Deduplicate by id
      setComments(prev => {
        const seen = new Set(prev.map((c: any) => String(c.id)))
        const add = data.filter((c: any) => !seen.has(String(c.id)))
        return [...prev, ...add]
      })
      setCommentsNextUrl(res.data?.pagination?.next_page_url || null)
    } catch (err) {
      console.error("Error fetching comments:", err)
      toast.error("Failed to load comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  // Fetch replies for 1 comment
  const fetchReplies = async (commentId: string | number) => {
    const key = String(commentId)
    if (repliesLoading[key]) return
    const nextUrl = repliesNextUrl[key] ?? `/api/announcements-only/replies/${key}?page=1`

    setRepliesLoading((p: any) => ({ ...p, [key]: true }))
    try {
      const res = await api2.get<any>(nextUrl)
      const incoming = res.data?.data ?? []
      setComments(prev =>
        prev.map(c => {
          if (String(c.id) !== key) return c
          const curr = Array.isArray(c.replies) ? c.replies : []
          const seen = new Set(curr.map((r: any) => String(r.id)))
          const add = incoming.filter((r: any) => !seen.has(String(r.id)))
          const nextCount = Math.max((c.replies_count || 0) - add.length, 0)
          return {
            ...c,
            replies: [...curr, ...add],
            replies_count: nextCount,
          }
        })
      )
      const next = res.data?.pagination?.next_page_url || null
      setRepliesNextUrl((p: any) => ({ ...p, [key]: next }))
    } catch (err) {
      console.error("Error fetching replies:", err)
      toast.error("Failed to load replies")
    } finally {
      setRepliesLoading((p: any) => ({ ...p, [key]: false }))
    }
  }

  // Delete comment
  const handleDeleteComment = async (commentId: string | number) => {
    try {
      await api2.delete(`/api/comments/${commentId}`)
      
      const deletedComment = comments.find(c => String(c.id) === String(commentId))
      const repliesCount = deletedComment?.replies_count || 0;

      console.log("repliesCount", repliesCount)
      
      setComments(prev => prev.filter(c => String(c.id) !== String(commentId)))
      setCurrentCommentsCount((n: number) => Math.max(n - 1 - repliesCount, 0))
      
      toast.success("Comment deleted successfully")
    } catch (error) {
      console.error("Failed to delete comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  // Delete reply
  const handleDeleteReply = async (replyId: string | number, commentId: string | number) => {
    try {
      await api2.delete(`/api/comments/${replyId}`)
      setComments(prev =>
        prev.map(c => {
          if (String(c.id) === String(commentId)) {
            const updatedReplies = Array.isArray(c.replies) 
              ? c.replies.filter((r: any) => String(r.id) !== String(replyId))
              : [];
            return {
              ...c,
              replies: updatedReplies,
            };
          }
          return c;
        })
      );
      toast.success("Reply deleted successfully");
    } catch (error) {
      console.error("Failed to delete reply:", error);
      toast.error("Failed to delete reply");
    }
  };


  // Add reply
  const handleAddReply = async (commentId: string | number) => {
    if (!newReply.trim() || !CURRENT_USER.id) return
    try {
      const payload = {
        announcement_id: id,
        user_id: CURRENT_USER.id,
        content: newReply,
        parent_id: commentId,
      }
      const res = await api2.post<any>("/api/comments", payload)
      const replyItem = { ...res.data, user: CURRENT_USER }
      setComments(prev =>
        prev.map(c => {
          if (String(c.id) === String(commentId)) {
            const curr = Array.isArray(c.replies) ? c.replies : []
            const count = typeof c.replies_count === "number" ? c.replies_count : 0
            return {
              ...c,
              replies: [...curr, replyItem],
              replies_count: Math.max(count - 1, 0),
            }
          }
          return c
        })
      )
      setNewReply("")
      setReplyingTo(null)
      toast.success("Reply added successfully")
    } catch (error) {
      console.error("Failed to add reply:", error)
      toast.error("Failed to add reply")
    }
  }

  // Edit
  const handleEditPost = () => {
    setIsEditDialogOpen(true)
    setEditedContent(content)
    setTitleEdit(title)
  }
  const handleSaveEdit = async () => {
    try {
      await api2.put(`/api/announcements/${id}`, {
        title: titleEdit,
        content: editedContent,
      })
      setIsEditDialogOpen(false)
      onUpdateSuccess()
      toast.success("Announcement updated successfully")
    } catch (error) {
      console.error("Failed to update announcement:", error)
      toast.error("Failed to update announcement")
    }
  }

  // Delete
  const handleDeletePost = async () => {
    try {
      await api2.delete(`/api/announcements/${id}`)
      setIsDeleteDialogOpen(false)
      onDeleteSuccess()
      toast.success("Announcement deleted successfully")
    } catch (error) {
      console.error("Failed to delete announcement:", error)
      toast.error("Failed to delete announcement")
    }
  }

  // Toggle comments and load initial page
  const toggleComments = () => {
    const next = !showComments
    setShowComments(next)
    if (next && comments.length === 0) {
      fetchComments()
    }
  }

  return (
    <Card className="sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              {announcement.admin?.profile_path ? (
                <AvatarImage
                  src={announcement.admin.profile_path || "/placeholder.svg"}
                  alt={announcement.admin.name}
                />
              ) : (
                <AvatarFallback>
                  {announcement.admin?.name?.charAt(0).toUpperCase()}
                </AvatarFallback>
              )}
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">{announcement.admin?.name}</h3>
              <p className="text-xs text-muted-foreground">
                {new Date(created_at).toLocaleString()}
              </p>
            </div>
          </div>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">More options</span>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={handleEditPost}>
                  <Edit className="mr-2 h-4 w-4" />
                  Edit
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setIsDeleteDialogOpen(true)}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Delete
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

        </div>
      </CardHeader>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Edit Announcement</DialogTitle>
            <DialogDescription>
              Make changes to your announcement here. Click save when you&apos;re done.
            </DialogDescription>
          </DialogHeader>
          <Input value={titleEdit} onChange={e => setTitleEdit(e.target.value)} />
          <div className="grid gap-4 py-4">
            <Textarea
              value={editedContent}
              onChange={e => setEditedContent(e.target.value)}
              className="min-h-[200px]"
            />
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleSaveEdit}>Save changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>Delete Announcement</DialogTitle>
            <DialogDescription>
              Are you sure you want to delete this announcement? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost}>
              Delete
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Content */}
      <CardContent className="px-0 pb-3">
        <div className="flex flex-col lg:flex-row items-center md:items-start gap-6 px-6 pb-4">
          <div className="flex-1 w-full md:w-auto min-w-0">
            <h2 className="text-lg font-semibold mb-2">{title}</h2>
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">
              {content}
            </p>
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

      {/* Footer: Comments */}
      <CardFooter className="flex flex-col space-y-3 pt-0">
        <div className="flex items-center justify-between w-full text-sm text-muted-foreground px-2">
          <span>{currentCommentsCount} comments</span>
        </div>

        <Separator />

        <div className="flex items-center justify-around w-full">
          <Button variant="ghost" size="sm" className="flex-1 hover:bg-muted/50">
            <Heart className="h-4 w-4 mr-2" />
            <span>{currentLikes}</span>
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 hover:bg-muted/50"
            onClick={toggleComments}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>

        {showComments && (
          <>
            <Separator />

            {/* Comments list */}
            <div className="w-full space-y-4">
              {comments
                .filter((c: any) => !c.parent_id)
                .map((comment: any) => {
                  const user = comment.user
                  const displayName = getUserDisplayName(user)
                  const initials = getUserInitials(user)
                  const avatarSrc = user?.profile_path ? `${user.profile_path}` : null
                  const key = String(comment.id)
                  const repliesCount = typeof comment.replies_count === "number" ? comment.replies_count : 0
                  const hasMoreReplies = !!repliesNextUrl[key] || repliesCount > 0

                  return (
                    <div key={comment.id} className="space-y-3">
                      {/* Main Comment */}
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8 relative">
                          {avatarSrc ? (
                            <Image
                              src={`${avatarSrc}`}
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
                            <div className="flex justify-between items-start">
                              <p className="font-semibold text-sm">{displayName}</p>
                              {/* Delete button for admin */}
                              {isAdmin && (
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                  onClick={() => handleDeleteComment(comment.id)}
                                  title="Delete comment"
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{new Date(comment.created_at).toLocaleString()}</span>
                            {!isAdmin && (
                              <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto p-0 text-xs font-medium hover:bg-transparent hover:text-primary"
                                onClick={() =>
                                  setReplyingTo(replyingTo === key ? null : key)
                                }
                              >
                                Reply
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* Reply Input - Only show for non-admin users */}
                      {!isAdmin && replyingTo === key && (
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
                              <AvatarFallback className="text-xs">
                                {getUserInitials(CURRENT_USER)}
                              </AvatarFallback>
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
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!newReply.trim() || repliesLoading[key]}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="ml-10 pl-4 space-y-3 border-l border-muted-foreground/20">
                          {comment.replies.map((reply: any) => {
                            const replyUser = reply.user
                            const replyDisplayName = getUserDisplayName(replyUser)
                            const replyInitials = getUserInitials(replyUser)
                            const replyAvatarSrc = replyUser?.profile_path
                              ? `${replyUser.profile_path}`
                              : null
                            return (
                              <div
                                key={`${reply.id}-${reply.created_at || ""}`}
                                className="flex space-x-3"
                              >
                                <Avatar className="h-6 w-6">
                                  {replyAvatarSrc ? (
                                    <Image
                                      src={replyAvatarSrc || "/placeholder.svg"}
                                      alt={replyDisplayName}
                                      fill
                                      style={{ objectFit: "cover", borderRadius: "50%" }}
                                      sizes="24px"
                                    />
                                  ) : (
                                    <AvatarFallback className="text-xs">
                                      {replyInitials}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="bg-muted rounded-lg px-3 py-2">
                                    <div className="flex justify-between items-start">
                                      <p className="font-semibold text-sm">{replyDisplayName}</p>
                                      {/* Delete button for admin */}
                                      {isAdmin && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                          onClick={() => handleDeleteReply(reply.id, comment.id)}
                                          title="Delete reply"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
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
                <Button
                  variant="outline"
                  onClick={fetchComments}
                  disabled={commentsLoading}
                  className="w-full"
                >
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