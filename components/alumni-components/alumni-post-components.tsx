"use client"

import { useEffect, useMemo, useState } from "react"
import Image from "next/image"
import { Heart, MessageCircle, MoreHorizontal, Send, Loader2, Trash2, Edit } from 'lucide-react'
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
import { toast } from "sonner"
import { useAuth } from "@/contexts/AuthContext"
import { api2 } from "@/lib/api"
import { useRouter } from "next/navigation";


export default function PostComponentsAlumni({ post, isAdmin, is_liked: initialIsLiked, status, fetchPosts, onPostDeleted }: any) {
  const [posts, setPosts] = useState<any>(post)
  const [isLiked, setIsLiked] = useState<boolean>(initialIsLiked)
  const router = useRouter();

  // Comments state (paginated)
  const [showComments, setShowComments] = useState(false)
  const [comments, setComments] = useState<any[]>([])
  const [commentsPage, setCommentsPage] = useState(1)
  const [hasMoreComments, setHasMoreComments] = useState(true)
  const [commentsLoading, setCommentsLoading] = useState(false)
  const [repliesLoading, setRepliesLoading] = useState<any>({})
  const [repliesPage, setRepliesPage] = useState<any>({})
  const [repliesHasMore, setRepliesHasMore] = useState<any>({})
  const [expandedComments, setExpandedComments] = useState<Set<string>>(new Set());

  // NEW: Loading states for various API interactions
  const [isAddingComment, setIsAddingComment] = useState(false)
  const [isAddingReply, setIsAddingReply] = useState(false)
  const [isTogglingLike, setIsTogglingLike] = useState(false)
  const [isEditingPost, setIsEditingPost] = useState(false)
  const [isDeletingPost, setIsDeletingPost] = useState(false)
  const [isChangingStatus, setIsChangingStatus] = useState(false)


  // Compose state
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")

  // Admin/author actions
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedTitle, setEditedTitle] = useState(posts.title)
  const [editedContent, setEditedContent] = useState(posts.content)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const { user } = useAuth()

  const CURRENT_USER: any = useMemo(() => {
    if (user?.id) {
      const first = user.name?.split(" ")[0] || ""
      const rest = user.name?.split(" ").slice(1).join(" ") || ""
      return {
        id: String(user.id),
        first_name: first,
        last_name: rest,
        profile_path: user.profile_path ?? null,
        full_name: user.name,
      }
    }
    return {
      id: "currentUser",
      first_name: "You",
      last_name: "",
      profile_path: null,
      full_name: "You",
    }
  }, [user])

  useEffect(() => {
    // console.log("Post updated:", posts)
  }, [post])

  // Helpers something
  const sameId = (a: any, b: any) => String(a) === String(b)

  // Fetch comments (paginated)
  const fetchComments = async () => {
    if (!hasMoreComments || commentsLoading) return
    setCommentsLoading(true)
    try {
      const res = await api2.get<any>(`/api/posts-only/comments/${posts.id}?page=${commentsPage}`)
      const newComments = res.data?.data ?? []

      const normalized = newComments.map((c: any) => ({
        ...c,
        replies: Array.isArray(c.replies) ? c.replies : [],
        replies_count: typeof c.replies_count === "number" ? c.replies_count : (c.replies?.length || 0),
      }))

      setComments(prev => {
        const combined = [...prev, ...normalized]
        return combined.filter((c, i, arr) => arr.findIndex(x => String(x.id) === String(c.id)) === i)
      })
      setHasMoreComments(!!res.data?.next_page_url)
      setCommentsPage(prev => prev + 1)
    } catch (err) {
      console.error("Error fetching comments:", err)
      toast.error("Failed to load comments")
    } finally {
      setCommentsLoading(false)
    }
  }

  // Fetch replies for a specific comment (append to that comment only)
  async function fetchReplies(commentId: string) {
    if (repliesLoading[commentId]) return
    setRepliesLoading((prev: any) => ({ ...prev, [commentId]: true }))
    try {
      const page = repliesPage[commentId] || 1
      const res = await api2.get<any>(`/api/posts-only/replies/${commentId}?page=${page}`)
      const newReplies = res.data?.data ?? []
      newReplies.sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())

      setComments(prev =>
        prev.map((c: any) => {
          if (String(c.id) === String(commentId)) {
            const combined = [...(c.replies || []), ...newReplies]
            const deduped = combined.filter(
              (r: any, i: number, arr: any[]) =>
                arr.findIndex((x: any) => String(x.id) === String(r.id)) === i
            )
            return {
              ...c,
              replies: deduped,
              replies_count: Math.max((c.replies_count || 0) - newReplies.length, 0),
            }
          }
          return c
        })
      )

      const hasMore =
        !!(res.data?.pagination?.next_page_url || res.data?.next_page_url)
      setRepliesHasMore((prev: any) => ({ ...prev, [commentId]: hasMore }))
      if (hasMore) {
        setRepliesPage((prev: any) => ({ ...prev, [commentId]: page + 1 }))
      }
      
      setExpandedComments(prev => new Set(prev.add(String(commentId))));
    } catch (err) {
      console.error("Error fetching replies:", err)
      toast.error("Failed to load replies")
    } finally {
      setRepliesLoading((prev: any) => ({ ...prev, [commentId]: false }))
    }
  }

  // Delete commentsss
  const handleDeleteComment = async (commentId: string) => {
    // NEW: No loading state as of now
    try {
      await api2.delete(`/api/posts/comments/${commentId}`)
      setComments(prev => prev.filter(c => String(c.id) !== String(commentId)))
      const deleted = comments.find(c => String(c.id) === String(commentId))
      console.log("deleted", deleted?.replies_count)
      setPosts((prev: any) => ({
        ...prev,
        comments_count: prev?.comments_count - deleted?.replies_count - 1,
      }))
      toast.success("Comment deleted successfully")
    } catch (error) {
      console.error("Error deleting comment:", error)
      toast.error("Failed to delete comment")
    }
  }

  // Open comments the first time
  useEffect(() => {
    if (showComments && comments.length === 0) {
      fetchComments()
    }
  }, [showComments])

  // Add comment
  const handleAddComment = async () => {
    if (!newComment.trim()) return
    setIsAddingComment(true) // NEW: Start loading state
    try {
      const payload = { post_id: posts.id, content: newComment }
      const response = await api2.post<any>("/api/posts/comments", payload)
      const commentWithUser: any = {
        ...response.data,
        user: CURRENT_USER,
        replies_count: 0,
        replies: [],
      }
      setComments(prev => [commentWithUser, ...prev])
      setNewComment("")
      setPosts((prev: any) => ({
        ...prev,
        comments_count: (prev?.comments_count || 0) + 1,
      }))
      toast.success("Comment added")
    } catch (error) {
      console.error("Error adding comment:", error)
      toast.error("Failed to add comment")
    } finally {
      setIsAddingComment(false) // NEW: End loading state
    }
  }

  // Add reply
  const handleAddReply = async (commentId: string) => {
    if (!newReply.trim()) return
    setIsAddingReply(true) // NEW: Start loading state
    try {
      const response = await api2.post<any>("/api/posts/comments", {
        post_id: posts.id,
        parent_id: commentId,
        content: newReply,
      })
      const replyWithUser: any = { ...response.data, user: CURRENT_USER }

      setComments(prev =>
        prev.map(c => {
          if (sameId(c.id, commentId)) {
            const updatedReplies = [...(c.replies || []), replyWithUser];
            return {
              ...c,
              replies: updatedReplies,
              replies_count: (c.replies_count || 0) + 1,
            }
          }
          return c
        })
      )

      setPosts((prev: any) => ({
        ...prev,
        comments_count: (prev?.comments_count || 0) + 1,
      }))
      
      setExpandedComments(prev => {
        const newSet = new Set(prev);
        newSet.add(String(commentId));
        return newSet;
      });
      
      setNewReply("")
      setReplyingTo(null)
      toast.success("Reply added")
    } catch (error) {
      console.error("Error adding reply:", error)
      toast.error("Failed to add reply")
    } finally {
      setIsAddingReply(false) // NEW: End loading state
    }
  }

  // Like/unlike
  const handleLike = async () => {
    if(isAdmin) {
      toast.error("Admins cannot like posts")
      return
    }
    if (isTogglingLike) return
    setIsTogglingLike(true)
    try {
      const response = await api2.put<any>(`/api/posts/like/${posts.id}`)
      setIsLiked(v => !v)
      setPosts((prev: any) => ({
        ...prev,
        likes_count: response.data?.likes_count,
      }))
    } catch (error) {
      console.error("Error toggling like:", error)
      toast.error("Failed to update like")
    } finally {
      setIsTogglingLike(false) // NEW: End loading state
    }
  }

  // Admin change status
  const handleChangeStatus = async (newStatus: "accepted" | "declined") => {
    setIsChangingStatus(true) // NEW: Start loading state
    try {
      const res = await api2.put<any>(`/api/posts/change-status/${posts.id}`, { status: newStatus })
      toast.success(res.data?.message)
      console.log("Status changed:", res.data)
      fetchPosts()
    } catch (error) {
      console.error(error)
      toast.error("Failed to change status")
    } finally {
      setIsChangingStatus(false) // NEW: End loading state
    }
  }

  // Edit post
  const handleEditPost = async () => {
    setIsEditingPost(true) // NEW: Start loading state
    try {
      await api2.put(`/api/posts/${posts.id}`, { title: editedTitle, content: editedContent })
      setPosts((prev: any) => ({ ...prev, title: editedTitle, content: editedContent }))
      toast.success("Post updated successfully")
      setIsEditDialogOpen(false)
    } catch (error) {
      console.error(error)
      toast.error("Failed to update post")
    } finally {
      setIsEditingPost(false) // NEW: End loading state
    }
  }

  // Delete post
  const handleDeletePost = async () => {
      setIsDeletingPost(true) 
      try {
          await api2.delete(`/api/posts/${posts.id}`)
          toast.success("Post deleted successfully")
          setIsDeleteDialogOpen(false)
          onPostDeleted(posts.id); //Notify parent
      } catch (error) {
          console.error(error)
          toast.error("Failed to delete post")
      } finally {
          setIsDeletingPost(false)
      }
  }

  const postUser = posts.user
  const images = posts.images || []

  return (
    <>
      <Card className="sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Avatar className="h-10 w-10">
                {postUser?.profile_path ? (
                  <AvatarImage
                    src={String(postUser.profile_path) || "/placeholder.svg"}
                    alt={postUser?.full_name || `${postUser?.first_name ?? ""} ${postUser?.last_name ?? ""}`}
                  />
                ) : (
                  <AvatarFallback>
                    {(postUser?.first_name?.[0] || postUser?.name?.[0] || "U").toUpperCase()}
                  </AvatarFallback>
                )}
              </Avatar>
              <div>
                <h3 className="font-semibold text-sm">
                  {`${postUser?.first_name ?? ""} ${postUser?.last_name ?? ""}`.trim() ||
                    postUser?.full_name ||
                    postUser?.name ||
                    "User"}
                </h3>
                <p className="text-xs text-muted-foreground">{new Date(posts.created_at).toLocaleString()}</p>
              </div>
            </div>

            {/* Admin or Author menu */}
            {isAdmin ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full" aria-label="Admin actions" disabled={isChangingStatus}>
                    {isChangingStatus ? <Loader2 className="h-5 w-5 animate-spin" /> : <MoreHorizontal className="h-5 w-5" />}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="w-32">
                  <DropdownMenuItem onClick={() => handleChangeStatus("accepted")} className="capitalize">
                    Accept
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleChangeStatus("declined")} className="capitalize">
                    Decline
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : CURRENT_USER.id === String(postUser?.id) ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="p-1 rounded-full" aria-label="Post actions">
                    <MoreHorizontal className="h-5 w-5" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" sideOffset={5} className="w-32">
                  <DropdownMenuItem onClick={() => setIsEditDialogOpen(true)} className="capitalize">
                    <Edit className="mr-2 h-4 w-4" /> Edit
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    onClick={() => setIsDeleteDialogOpen(true)}
                    className="capitalize text-destructive"
                  >
                    <Trash2 className="mr-2 h-4 w-4" /> Delete
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : null}
          </div>
        </CardHeader>

        <CardContent className="px-0 pb-3">
          <div className="flex flex-col lg:flex-row items-center md:items-start gap-6 px-6 pb-4">
            <div className="flex-1 w-full md:w-auto min-w-0">
              <h2 className="text-lg font-semibold mb-2">{posts.title}</h2>
              <p className="text-muted-foreground leading-relaxed">{posts.content}</p>
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
            <span>{posts?.comments_count ?? 0} comments</span>
          </div>

          <Separator />

          <div className="flex items-center justify-around w-full">
            <Button
              variant="ghost"
              size="sm"
              className={`flex-1 hover:bg-muted/50 ${isLiked ? "text-blue-500" : "text-muted-foreground"}`}
              onClick={handleLike}
              disabled={isTogglingLike} // NEW: Disable during API call
            >
              <div className="flex items-center">
                {isTogglingLike ? (
                  <Loader2 className="h-4 w-4 animate-spin mr-1" />
                ) : (
                  <Heart className={`h-4 w-4 mr-1 ${isLiked ? "fill-blue-500" : "fill-none"}`} />
                )}
                {typeof posts?.likes_count === "number" && posts.likes_count > 0 ? (
                  <span className="text-xs ml-1">{posts.likes_count}</span>
                ) : (
                  <span className="text-xs ml-1">Like</span>
                )}
              </div>
            </Button>

            <Button
              variant="ghost"
              size="sm"
              className="flex-1 hover:bg-muted/50 text-muted-foreground"
              onClick={() => setShowComments(v => !v)}
            >
              <MessageCircle className="h-4 w-4 mr-2" />
              Comment
            </Button>
          </div>

          {showComments && (
            <>
              <Separator />

              <div className="w-full space-y-3">
                {/* Add comment - prevent admin ah */}
                {!isAdmin && (
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      {user?.profile_path ? (
                        <AvatarImage src={`${user.profile_path}`} alt={user?.name || "Your avatar"} />
                      ) : (
                        <AvatarFallback>{user?.name?.[0] || "Y"}</AvatarFallback>
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
                        <Button size="sm" onClick={handleAddComment} disabled={!newComment.trim() || isAddingComment}>
                          {isAddingComment ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : <Send className="h-4 w-4 mr-1" />}
                          {isAddingComment ? "Posting..." : "Post"}
                        </Button>
                      </div>
                    </div>
                  </div>
                )}

                {/* Comments list */}
                <div className="w-full space-y-4">
                  {comments
                    .filter((c: any) => !c.parent_id)
                    .map((comment: any) => (
                      <div key={comment.id} className="space-y-3">
                        {/* Comment */}
                        <div className="flex space-x-3">
                          <Avatar className="h-8 w-8">
                            {comment.user?.profile_path ? (
                              <AvatarImage
                                src={`${comment.user.profile_path}`}
                                alt={comment.user?.first_name || "User photo"}
                              />
                            ) : (
                              <AvatarFallback>
                                {(comment.user?.first_name?.[0] || "U").toUpperCase()}
                                {(comment.user?.last_name?.[0] || "").toUpperCase()}
                              </AvatarFallback>
                            )}
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="bg-muted rounded-lg px-3 py-2">
                              <div className="flex justify-between items-start">
                                <p className="font-semibold text-sm">
                                  {comment.user?.first_name} {comment.user?.middle_name} {comment.user?.last_name}
                                </p>
                                {/* Delete button for admin */}
                                {isAdmin && (
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                    onClick={() => handleDeleteComment(String(comment.id))}
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
                                  onClick={() => setReplyingTo(replyingTo === String(comment.id) ? null : String(comment.id))}
                                >
                                  Reply
                                </Button>
                              )}
                            </div>
                          </div>
                        </div>

                        {/* Reply form (indented) - only show for non-admin users */}
                        {!isAdmin && replyingTo === String(comment.id) && (
                          <div className="ml-10 pl-4 flex space-x-3 border-l border-muted-foreground/20">
                            <Avatar className="h-6 w-6">
                              {user?.profile_path ? (
                                <AvatarImage src={`${user.profile_path}`} alt={user?.name || "Your avatar"} />
                              ) : (
                                <AvatarFallback>{user?.name?.[0] || "Y"}</AvatarFallback>
                              )}
                            </Avatar>
                            <div className="flex-1 space-y-2">
                              <Textarea
                                placeholder={`Reply to ${comment.user?.first_name || "user"}...`}
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
                                  onClick={() => handleAddReply(String(comment.id))}
                                  disabled={!newReply.trim() || isAddingReply} // NEW: Disable during API call
                                >
                                  {isAddingReply ? <Loader2 className="h-4 w-4 animate-spin mr-1" /> : null}
                                  {isAddingReply ? "Replying..." : "Reply"}
                                </Button>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* Replies container (indented and at the bottom) */}
                        {Array.isArray(comment.replies) && comment.replies.length > 0 && (
                          <div className="ml-10 pl-4 space-y-3 border-l border-muted-foreground/20">
                            {comment.replies.map((reply: any) => (
                              <div key={reply.id} className="flex space-x-3">
                                <Avatar className="h-6 w-6">
                                  {reply.user?.profile_path ? (
                                    <AvatarImage
                                      src={`${reply.user.profile_path}`}
                                      alt={reply.user?.first_name || "User photo"}
                                    />
                                  ) : (
                                    <AvatarFallback>
                                      {(reply.user?.first_name?.[0] || "U").toUpperCase()}
                                      {(reply.user?.last_name?.[0] || "").toUpperCase()}
                                    </AvatarFallback>
                                  )}
                                </Avatar>
                                <div className="flex-1 space-y-1">
                                  <div className="bg-muted rounded-lg px-3 py-2">
                                    <div className="flex justify-between items-start">
                                      <p className="font-semibold text-sm">
                                        {reply.user?.first_name} {reply.user?.last_name}
                                      </p>
                                      {/* Delete button for admin */}
                                      {isAdmin && (
                                        <Button
                                          variant="ghost"
                                          size="sm"
                                          className="h-6 w-6 p-0 text-destructive hover:bg-destructive/10"
                                          onClick={() => handleDeleteComment(String(reply.id))}
                                          title="Delete reply"
                                        >
                                          <Trash2 className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
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

                        {/* Show replies button - only show if there are replies that haven't been loaded yet */}
                        {((comment.replies_count > 0 && comment.replies.length < comment.replies_count) ||
                          (repliesHasMore[String(comment.id)] && !expandedComments.has(String(comment.id)))) && (
                            <div className="ml-10 pl-4">
                              <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => fetchReplies(String(comment.id))}
                                disabled={repliesLoading[String(comment.id)]}
                              >
                                {repliesLoading[String(comment.id)] ? (
                                  <span className="inline-flex items-center">
                                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                    Loading replies...
                                  </span>
                                ) : (
                                  `Show ${comment.replies_count - comment.replies.length} more replies`
                                )}
                              </Button>
                            </div>
                          )}
                      </div>
                    ))}

                  {/* Load more comments */}
                  {hasMoreComments && (
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
              </div>
            </>
          )}
        </CardFooter>
      </Card>

      {/* Edit Dialog */}
      <Dialog open={isEditDialogOpen} onOpenChange={setIsEditDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label htmlFor="title" className="text-sm font-medium">
                Title
              </label>
              <Input id="title" value={editedTitle} onChange={e => setEditedTitle(e.target.value)} />
            </div>
            <div className="space-y-2">
              <label htmlFor="content" className="text-sm font-medium">
                Content
              </label>
              <Textarea
                id="content"
                value={editedContent}
                onChange={e => setEditedContent(e.target.value)}
                className="min-h-[100px] max-h-[300px] overflow-y-auto"
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsEditDialogOpen(false)} disabled={isEditingPost}>
              Cancel
            </Button>
            <Button onClick={handleEditPost} disabled={isEditingPost}>
              {isEditingPost ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isEditingPost ? "Saving..." : "Save Changes"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Dialog */}
      <Dialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Delete Post</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <p>Are you sure you want to delete this post? This action cannot be undone.</p>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsDeleteDialogOpen(false)} disabled={isDeletingPost}>
              Cancel
            </Button>
            <Button variant="destructive" onClick={handleDeletePost} disabled={isDeletingPost}>
              {isDeletingPost ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
              {isDeletingPost ? "Deleting..." : "Delete"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  )
}