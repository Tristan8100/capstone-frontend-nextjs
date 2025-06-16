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

interface Comment {
  id: string
  author: string
  avatar: string
  content: string
  timestamp: string
  replies?: Comment[]
}

export default function AnnouncementComponent() {
  const [showComments, setShowComments] = useState(false)
  const [newComment, setNewComment] = useState("")
  const [replyingTo, setReplyingTo] = useState<string | null>(null)
  const [newReply, setNewReply] = useState("")
  const [isEditDialogOpen, setIsEditDialogOpen] = useState(false)
  const [editedContent, setEditedContent] = useState("")
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)

  const images = [
    "/static/TSBA Logo.png",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
    "/placeholder.svg?height=400&width=600",
  ]

  const [comments, setComments] = useState<Comment[]>([
    {
      id: "1",
      author: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "This looks absolutely amazing! Can't wait to try it out. When will it be available?",
      timestamp: "1h",
      replies: [
        {
          id: "1-1",
          author: "Acme Corporation",
          avatar: "/placeholder.svg?height=32&width=32",
          content: "Thanks Sarah! We're planning to launch next month. Stay tuned for updates!",
          timestamp: "45m",
        },
      ],
    },
    {
      id: "2",
      author: "Mike Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "The design looks incredible. Your team has outdone themselves!",
      timestamp: "2h",
    },
    {
      id: "3",
      author: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      content: "Finally! I've been waiting for something like this. The innovation is exactly what the market needs.",
      timestamp: "3h",
      replies: [
        {
          id: "3-1",
          author: "David Kim",
          avatar: "/placeholder.svg?height=32&width=32",
          content: "Totally agree! This is going to be a game changer.",
          timestamp: "2h",
        },
      ],
    },
  ])

  const handleAddComment = () => {
    if (newComment.trim()) {
      const newCommentObj: Comment = {
        id: Date.now().toString(),
        author: "Current User",
        avatar: "/placeholder.svg?height=32&width=32",
        content: newComment,
        timestamp: "Just now",
      }
      setComments([...comments, newCommentObj])
      setNewComment("")
    }
  }

  const handleAddReply = (commentId: string) => {
    if (newReply.trim()) {
      const updatedComments = comments.map(comment => {
        if (comment.id === commentId) {
          const newReplyObj: Comment = {
            id: `${commentId}-${Date.now()}`,
            author: "Current User",
            avatar: "/placeholder.svg?height=32&width=32",
            content: newReply,
            timestamp: "Just now",
          }
          return {
            ...comment,
            replies: [...(comment.replies || []), newReplyObj]
          }
        }
        return comment
      })
      setComments(updatedComments)
      setNewReply("")
      setReplyingTo(null)
    }
  }

  const handleEditPost = () => {
    setIsEditDialogOpen(true)
    // Set initial content for editing - in a real app this would be the current post content
    setEditedContent("We're thrilled to announce the launch of our revolutionary new product line! After months of development and testing, we're finally ready to share something truly special with our community. These images showcase just a glimpse of what's to come. Stay tuned for more details and get ready to experience innovation like never before! #Innovation #ProductLaunch #Exciting")
  }

  const handleSaveEdit = () => {
    // In a real app, you would save the edited content to your database here
    console.log("Saving edited content:", editedContent)
    setIsEditDialogOpen(false)
  }

  const handleDeletePost = () => {
    // In a real app, you would delete the post from your database here
    console.log("Deleting post")
    setIsDeleteDialogOpen(false)
  }

  return (
    <Card className="w-[350px] sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl mx-auto">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Avatar className="h-10 w-10">
              <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Company Logo" />
              <AvatarFallback>AC</AvatarFallback>
            </Avatar>
            <div>
              <h3 className="font-semibold text-sm">Acme Corporation</h3>
              <p className="text-xs text-muted-foreground">2 hours ago</p>
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
              <DropdownMenuItem>
                <Heart className="mr-2 h-4 w-4" />
                Save post
              </DropdownMenuItem>
              <DropdownMenuItem>
                <MessageCircle className="mr-2 h-4 w-4" />
                Hide post
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
              Make changes to your announcement here. Click save when you're done.
            </DialogDescription>
          </DialogHeader>
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

      <CardContent className="px-0 pb-3">
        <div className="flex flex-col lg:flex-row items-center md:items-start gap-6 px-6 pb-4">
          <div className="flex-1 w-full md:w-auto min-w-0">
            <h2 className="text-lg font-semibold mb-2">🎉 Exciting Product Launch Announcement!</h2>
            <p className="text-muted-foreground leading-relaxed">
              We're thrilled to announce the launch of our revolutionary new product line! After months of development and
              testing, we're finally ready to share something truly special with our community. These images showcase just
              a glimpse of what's to come. Stay tuned for more details and get ready to experience innovation like never
              before!
              <span className="text-primary font-medium"> #Innovation #ProductLaunch #Exciting</span>
            </p>
          </div>

          <Carousel className="flex-1 w-full lg:w-auto min-w-0">
            <CarouselContent>
              {images.map((src, index) => (
                <CarouselItem key={index}>
                  <div className="relative">
                    <Image
                      src={src || "/placeholder.svg"}
                      alt={`Announcement image ${index + 1}`}
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

            {/* Add New Comment */}
            <div className="w-full space-y-3">
              <div className="flex space-x-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src="/placeholder.svg?height=32&width=32" alt="Your avatar" />
                  <AvatarFallback>YU</AvatarFallback>
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
              {comments.map((comment) => (
                <div key={comment.id} className="space-y-3">
                  {/* Main Comment */}
                  <div className="flex space-x-3">
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={comment.avatar || "/placeholder.svg"} alt={comment.author} />
                      <AvatarFallback>
                        {comment.author
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-1">
                      <div className="bg-muted rounded-lg px-3 py-2">
                        <p className="font-semibold text-sm">{comment.author}</p>
                        <p className="text-sm">{comment.content}</p>
                      </div>
                      <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                        <span>{comment.timestamp}</span>
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

                  {/* Reply Input */}
                  {replyingTo === comment.id && (
                    <div className="ml-11 flex space-x-3">
                      <Avatar className="h-6 w-6">
                        <AvatarImage src="/placeholder.svg?height=24&width=24" alt="Your avatar" />
                        <AvatarFallback className="text-xs">YU</AvatarFallback>
                      </Avatar>
                      <div className="flex-1 space-y-2">
                        <Textarea
                          placeholder={`Reply to ${comment.author}...`}
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
                      {comment.replies.map((reply) => (
                        <div key={reply.id} className="flex space-x-3">
                          <Avatar className="h-6 w-6">
                            <AvatarImage src={reply.avatar || "/placeholder.svg"} alt={reply.author} />
                            <AvatarFallback className="text-xs">
                              {reply.author
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 space-y-1">
                            <div className="bg-muted rounded-lg px-3 py-2">
                              <p className="font-semibold text-sm">{reply.author}</p>
                              <p className="text-sm">{reply.content}</p>
                            </div>
                            <div className="flex items-center space-x-4 text-xs text-muted-foreground">
                              <span>{reply.timestamp}</span>
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
  )
}