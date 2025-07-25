"use client"

import { useState, useEffect, useRef } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreHorizontal, Send } from "lucide-react"

import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"
import { Separator } from "@/components/ui/separator"
import { Textarea } from "@/components/ui/textarea"
import { useAuth } from "@/contexts/AuthContext"
import { api2 } from "@/lib/api"
import { toast } from "sonner"
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"

export default function PostComponentsAlumni({ post, isAdmin, status }: { post: any, isAdmin: boolean, status: string }) {
  const [posts, setPosts] = useState(post)
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")

  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState(post.title)
  const [editedContent, setEditedContent] = useState(post.content)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { user } = useAuth()

  const CURRENT_USER: any = user?.id
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
      }

  useEffect(() => {
    console.log("Post data:", post)
  }, [post])

  const handleAddComment = async () => {
    if (newComment.trim()) {
      try{
        const payload = {
          post_id: post.id,
          content: newComment,
        }
        const response = await api2.post<any>("/api/posts/comments", payload)

        const commentWithUser = {
          ...response.data,
          user: CURRENT_USER,
          timestamp: new Date(response.data.created_at).toLocaleString(),
        }

        setPosts((prev) => ({
          ...prev,
          comments: [...(prev.comments || []), { ...commentWithUser, replies: [] }],
        }));
      }catch (error) {
        
      }
      console.log("Adding comment:", newComment)
      setNewComment("")
    }
  }

  const handleAddReply = async (commentId: string) => {
    if (newReply.trim()) {
      console.log("Adding reply to comment", commentId, ":", newReply)
      try{
        const response = await api2.post<any>("/api/posts/comments", { //same routes just adds parent_id
          post_id: post.id,
          parent_id: commentId,
          content: newReply
        })

        const replyWithUser = {
          ...response.data,
          user: CURRENT_USER,
          timestamp: new Date(response.data.created_at).toLocaleString(),
        }

        setPosts((prev) => ({
          ...prev,
          comments: prev.comments.map((comment) => {
            if (comment.id === commentId) {
              return {
                ...comment,
                replies: [...(comment.replies || []), replyWithUser],
              }
            }
            return comment
          }),
        }))
      }catch (error) {
        
      }
      setNewReply("")
      setReplyingTo(null)
    }
  }

  // Handler to update status
  const handleChangeStatus = async (newStatus: "accepted" | "declined") => {
    console.log("Change status to:", newStatus)
    try{
      const res = await api2.put<any>(`/api/posts/change-status/${post.id}`, { status: newStatus })
      toast.success(res.data.message)
    }catch (error) {
      console.log(error)
    }
  }

  // Handler for editing post
  const handleEditPost = async () => {
    try {
      const response = await api2.put(`/api/posts/${post.id}`, {
        title: editedTitle,
        content: editedContent
      });
      
      setPosts(prev => ({
        ...prev,
        title: editedTitle,
        content: editedContent
      }));
      
      toast.success("Post updated successfully");
      setIsEditDialogOpen(false);
    } catch (error) {
      toast.error("Failed to update post");
      console.error(error);
    }
  }

  // Handler for deleting post
  const handleDeletePost = async () => {
    try {
      await api2.delete(`/api/posts/${post.id}`);
      toast.success("Post deleted successfully");
      // You might want to add a callback here to remove the post from the parent component's state
      setIsDeleteDialogOpen(false);
    } catch (error) {
      toast.error("Failed to delete post");
      console.error(error);
    }
  }

  const postuser = posts.user
  const images = posts.images || []
  const comments = posts.comments || []

  // Options for the dropdown based on current status, CHANGE SINCE IT'S ON PASTENSE
  const statusOptions = ["accepted", "declined"].filter((s) => s !== status.toLowerCase())

  return (
    <>
      <Card className="sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {postuser?.profile_path ? (
                  <Image
                    src={`${postuser.profile_path}`}
                    alt={postuser?.name ? `${postuser.name}` : "User profile picture"}
                    fill
                    style={{ objectFit: "cover", borderRadius: "50%" }}
                    sizes="32px"
                    priority
                  />
                ) : (
                  <AvatarFallback>
                    {postuser?.name?.[0] || "U"}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">{`${postuser?.first_name} ${postuser?.last_name}`}</h3>
                <p className="text-xs text-muted-foreground">{new Date(post.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Admin Dropdown */}
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="w-28">
                  <DropdownMenuItem
                    onClick={() => handleChangeStatus("accepted")}
                    className="capitalize"
                  >
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => handleChangeStatus("declined")}
                    className="capitalize"
                  >
                    Decline
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="w-28">
                  <DropdownMenuItem 
                    onClick={() => setIsEditDialogOpen(true)}
                    className="capitalize"
                  >
                    Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="capitalize text-destructive"
                  >
                    Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}

          </div>
        </CardHeader>

        <CardContent className="px-0 pb-3">
          <div className="flex flex-col lg:flex-row items-center md:items-start gap-6 px-6 pb-4">
            <div className="flex-1 w-full md:w-auto min-w-0">
              <h2 className="text-lg font-semibold mb-2">{posts.title}</h2>
              <p className="text-muted-foreground leading-relaxed">
                {posts.content}
              </p>
            </div>
            {images.length > 0 && (
              <Carousel className="flex-1 w-full lg:w-auto min-w-0">
                <CarouselContent>
                  {images.map((img: any, index: number) => (
                    <CarouselItem key={img.id || index}>
                      <div className="relative">
                        <Image
                          src={`${img.image_file}`}
                          alt={`Post image ${index + 1}`}
                          width={600}
                          height={400}
                          className="w-full h-96 object-cover"
                        />
                        <div className="absolute top-4 right-4 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
                          {index + 1} / {images.length}
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

              <div className="w-full space-y-3">
                <div className="flex space-x-3">
                  <Avatar className="h-8 w-8">
                    {user?.profile_path ? (
                      <Image
                        src={`${user.profile_path}`}
                        alt={user?.name}
                        fill
                        style={{ objectFit: "cover", borderRadius: "50%" }}
                        sizes="32px"
                        priority
                      />
                    ) : (
                      <AvatarFallback>
                        {user?.name?.[0]}
                      </AvatarFallback>
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

              <div className="w-full space-y-4">
                {(posts.comments || [])
                  .filter((c: any) => !c.parent_id)
                  .map((comment: any) => (
                    <div key={comment.id} className="space-y-3">
                      {/* Comment */}
                      <div className="flex space-x-3">
                        <Avatar className="h-8 w-8">
                          {comment.user?.profile_path ? (
                            <Image
                              src={`${comment.user.profile_path}`}
                              alt={ `${comment.user?.first_name}` || "user photo"}
                              fill
                              style={{ objectFit: "cover", borderRadius: "50%" }}
                              sizes="32px"
                              priority
                            />
                          ) : (
                            <AvatarFallback>
                              {comment.user?.first_name?.[0]}
                              {comment.user?.last_name?.[0]}
                            </AvatarFallback>
                          )}
                        </Avatar>
                        <div className="flex-1 space-y-1">
                          <div className="bg-muted rounded-lg px-3 py-2">
                            <p className="font-semibold text-sm">
                              {comment.user?.first_name} {comment.user?.middle_name} {comment.user?.last_name}
                            </p>
                            <p className="text-sm">{comment.content}</p>
                          </div>
                          <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                            <span>{new Date(comment.created_at).toLocaleString()}</span>
                            <Button
                              variant="ghost"
                              size="sm"
                              className="h-auto p-0 text-xs font-medium hover:bg-transparent hover:text-primary"
                              onClick={() => setReplyingTo(replyingTo === comment.id ? null : comment.id)}
                            >
                              Reply
                            </Button>
                          </div>
                        </div>
                      </div>

                      {/* Reply Form */}
                      {replyingTo === comment.id && (
                        <div className="ml-11 flex space-x-3">
                          <Avatar className="h-6 w-6">
                            {user?.profile_path ? (
                              <Image
                                src={`${user.profile_path}`}
                                alt={user?.name}
                                fill
                                style={{ objectFit: "cover", borderRadius: "50%" }}
                                sizes="32px"
                                priority
                              />
                            ) : (
                              <AvatarFallback>
                                {user?.name?.[0]}
                                {user?.name?.[0]}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 space-y-2">
                            <Textarea
                              placeholder={`Reply to ${comment.user?.first_name}...`}
                              value={newReply}
                              onChange={(e) => setNewReply(e.target.value)}
                              className="min-h-[50px] resize-none text-sm"
                            />
                            <div className="flex justify-end space-x-2">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => {
                                  setReplyingTo(null);
                                  setNewReply("");
                                }}
                              >
                                Cancel
                              </Button>
                              <Button
                                size="sm"
                                onClick={() => handleAddReply(comment.id)}
                                disabled={!newReply.trim()}
                              >
                                Reply
                              </Button>
                            </div>
                          </div>
                        </div>
                      )}

                      {/* Replies */}
                      {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                        <div className="ml-11 space-y-3">
                          {comment.replies.map((reply: any) => (
                            <div key={reply.id} className="flex space-x-3">
                              <Avatar className="h-6 w-6">
                                {reply.user?.profile_path ? (
                                  <Image
                                    src={`${reply.user.profile_path}`}
                                    alt={reply.user?.first_name}
                                    fill
                                    style={{ objectFit: "cover", borderRadius: "50%" }}
                                    sizes="32px"
                                    priority
                                  />
                                ) : (
                                  <AvatarFallback>
                                    {reply.user?.first_name?.[0]}
                                    {reply.user?.last_name?.[0]}
                                  </AvatarFallback>
                                )}
                              </Avatar>
                              <div className="flex-1 space-y-1">
                                <div className="bg-muted rounded-lg px-3 py-2">
                                  <p className="font-semibold text-sm">
                                    {reply.user?.first_name} {reply.user?.last_name}
                                  </p>
                                  <p className="text-sm">{reply.content}</p>
                                </div>
                                <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                                  <span>{new Date(reply.created_at).toLocaleString()}</span>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  ))}
              </div>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Edit Post Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title">Title</label>
              <Input
                id="title"
                value={editedTitle}
                onChange={(e) => setEditedTitle(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label htmlFor="content">Content</label>
              <Textarea
                id="content"
                value={editedContent}
                onChange={(e) => setEditedContent(e.target.value)}
                className="min-h-[100px]"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)}>
              Cancel
            </Button>
            <Button onClick={handleEditPost}>Save Changes</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Post Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </div>
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
    </>
  )
}