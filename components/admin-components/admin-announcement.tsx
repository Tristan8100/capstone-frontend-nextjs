"use client"

import { useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreHorizontal, Send, Edit, Trash2 } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
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
// --- Import types from the page.tsx file ---
import type { User, Comment, AnnouncementProps } from "@/app/admin/announcements/page"
import { Input } from "../ui/input"

// --- Helper Functions (kept here as they are specific to this component's rendering) ---
function getInitials(name: string) {
  if (!name) return "??"
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
}

function getUserDisplayName(user: User) {
  if (user.full_name) return user.full_name
  const names = [user.first_name, user.middle_name, user.last_name].filter(Boolean)
  if (names.length === 0) return "??"
  return names.join(" ")
}

function getUserInitials(user: User) {
  const firstInitial = user.first_name?.[0] ?? ""
  const middleInitial = user.middle_name ? user.middle_name[0] : ""
  const lastInitial = user.last_name?.[0] ?? ""
  const initials = [firstInitial, middleInitial, lastInitial].filter(Boolean).join("")
  return initials || "??"
}

export default function AdminAnnouncementComponent({
  id,
  title,
  content,
  images,
  comments: initialComments,
  admin_id,
  created_at,
  updated_at,
  onDeleteSuccess,
  onUpdateSuccess,
}: AnnouncementProps) {
  const [showComments, setShowComments] = useState(false)
  const [titleEdit, setTitleEdit] = useState(title)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedContent, setEditedContent] = useState(content)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>(initialComments)
  const { user } = useAuth()

  const CURRENT_USER: User = user?.id
    ? {
        id: user.id.toString(), // FIX: Ensure user.id is converted to string
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
      }

  const handleAddComment = async () => {
    if (newComment.trim() && CURRENT_USER.id) {
      try {
        const payload = {
          announcement_id: id,
          user_id: CURRENT_USER.id,
          content: newComment,
        }
        const response = await api2.post<Comment>("/api/comments", payload)
        const addedComment = response.data

        const commentWithUser: Comment = {
          ...addedComment,
          user: CURRENT_USER,
          timestamp: new Date(addedComment.created_at).toLocaleString(),
          replies: [],
        }

        setComments((prevComments) => [...prevComments, commentWithUser])
        setNewComment("")
        console.log("New comment added:", commentWithUser)
      } catch (error) {
        console.error("Failed to add comment:", error)
      }
    }
  }

  //not working yet (especially for admin, will delete later)
  const handleAddReply = async (commentId: string | number) => {
    if (newReply.trim() && CURRENT_USER.id) {
      try {
        const payload = {
          announcement_id: id,
          user_id: CURRENT_USER.id,
          content: newReply,
          parent_id: commentId,
        }
        const response = await api2.post<Comment>("/api/comments", payload)
        const addedReply = response.data

        const replyWithUser: Comment = {
          ...addedReply,
          user: CURRENT_USER,
          timestamp: new Date(addedReply.created_at).toLocaleString(),
        }

        setComments((prevComments) =>
          prevComments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), replyWithUser],
              }
            }
            return comment
          }),
        )
        setNewReply("")
        setReplyingTo(null)
        console.log("New reply added:", replyWithUser)
      } catch (error) {
        console.error("Failed to add reply:", error)
      }
    }
  }

  const handleEditPost = () => {
    setIsEditDialogOpen(true)
    setEditedContent(content)
  }

  const handleSaveEdit = async () => {
    try {
      const response = await api2.put(`/api/announcements/${id}`, {
        title: titleEdit, //from usestate
        content: editedContent,
      })
      console.log("Announcement updated successfully:", response.data)
      setIsEditDialogOpen(false)
      onUpdateSuccess() //notify parent
    } catch (error) {
      console.error("Failed to update announcement:", error)
    }
  }

  const handleDeletePost = async () => {
    try {
      await api2.delete(`/api/announcements/${id}`)
      console.log("Announcement deleted successfully.")
      setIsDeleteDialogOpen(false)
      onDeleteSuccess() //notify parent
    } catch (error) {
      console.error("Failed to delete announcement:", error)
    }
  }

  return (
    <Card className="w-[350px] sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
      {/* Header */}
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <Image src="/static/TSBA Logo.png" width={40} height={40} alt="Admin" />
              <AvatarFallback>AD</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Admin</h3>
              <p className="text-xs text-muted-foreground">{new Date(created_at).toLocaleString()}</p>
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
          <Input value={titleEdit} onChange={(e) => setTitleEdit(e.target.value)}></Input>
          <div className="grid gap-4 py-4">
            <Textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
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
      {/* Delete Confirmation Dialog */}
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
            <p className="text-muted-foreground leading-relaxed whitespace-pre-line">{content}</p>
          </div>
          {images.length > 0 && (
            <Carousel className="flex-1 w-full lg:w-auto min-w-0">
              <CarouselContent>
                {images.map((img, i) => (
                  <CarouselItem key={img.id}>
                    <div className="relative">
                      <Image
                        src={`${img.image_file}`} //MODIFIED
                        alt={img.image_name}
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
          <span>{comments.length} comments</span>
        </div>
        <Separator />
        <div className="flex items-center justify-around w-full">
          <Button variant="ghost" size="sm" className="flex-1 hover:bg-muted/50">
            <Heart className="h-4 w-4 mr-2" />
            Like
          </Button>
          <Button
            variant="ghost"
            size="sm"
            className="flex-1 hover:bg-muted/50"
            onClick={() => setShowComments(!showComments)}
          >
            <MessageCircle className="h-4 w-4 mr-2" />
            Comment
          </Button>
        </div>
        {showComments && (
          <>
            <Separator />
            {/* Add New Comment */}
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
                      priority
                    />
                  ) : (
                    <AvatarFallback>{getUserInitials(CURRENT_USER)}</AvatarFallback>
                  )}
                </Avatar>
                <div className="flex-1 space-y-2">
                  <Textarea
                    placeholder="Write a comment..."
                    value={newComment}
                    onChange={(e) => setNewComment(e.target.value)}
                    className="min-h-[60px] resize-none"
                  />
                  <div className="flex justify-end">
                    <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim()}>
                      <Send className="h-4 w-4 mr-1" />
                      Post
                    </Button>
                  </div>
                </div>
              </div>
            </div>
            <Separator />
            {/* Comments List */}
            <div className="w-full space-y-4">
              {comments
                .filter((comment) => !comment.parent_id)
                .map((comment) => {
                  const user = comment.user
                  const displayName = getUserDisplayName(user)
                  const initials = getUserInitials(user)
                  const avatarSrc = user.profile_path ? `${user.profile_path}` : null
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
                              priority
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
                            <span>{comment.timestamp}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs font-medium hover:bg-transparent hover:text-primary"
                              onClick={() =>
                                setReplyingTo(replyingTo === comment.id.toString() ? null : comment.id.toString())
                              }
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>
                      {/* Reply Input */}
                      {replyingTo === comment.id.toString() && (
                        <div className="ml-11 flex space-x-3">
                          <Avatar className="h-6 w-6">
                            {CURRENT_USER.profile_path ? (
                              <Image
                                src={`${CURRENT_USER.profile_path}`}
                                alt={CURRENT_USER.full_name || "Your avatar"}
                                fill
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                sizes="24px"
                                priority
                              />
                            ) : (
                              <AvatarFallback className="text-xs">{getUserInitials(CURRENT_USER)}</AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder={`Reply to ${displayName}...`}
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
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
                              <Button size="sm" onClick={() => handleAddReply(comment.id)} disabled={!newReply.trim()}>
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}
                      {/* Replies */}
                      {comment.replies && comment.replies.length > 0 && (
                        <div className="ml-11 space-y-3">
                          {comment.replies.map((reply) => {
                            const replyUser = reply.user
                            const replyDisplayName = getUserDisplayName(replyUser)
                            const replyInitials = getUserInitials(replyUser)
                            const replyAvatarSrc = replyUser.profile_path
                              ? `${replyUser.profile_path}`
                              : null
                            return (
                              <div key={reply.id} className="flex space-x-3">
                                <Avatar className="h-6 w-6">
                                  {replyAvatarSrc ? (
                                    <AvatarImage src={replyAvatarSrc || "/placeholder.svg"} alt={replyDisplayName} />
                                  ) : (
                                    <AvatarFallback className="text-xs">{replyInitials}</AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="bg-muted rounded-lg px-3 py-2">
                                    <p className="font-semibold text-sm">{replyDisplayName}</p>
                                    <p className="text-sm">{reply.content}</p>
                                  </div>
                                  <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                    <span>{new Date(reply.created_at).toLocaleString()}</span>
                                  </div>
                                </div>
                              </div>
                            )
                          })}
                        </div>
                      )}
                    </div>
                  )
                })}
            </div>
          </>
        )}
      </CardFooter>
    </Card>
  )
}
