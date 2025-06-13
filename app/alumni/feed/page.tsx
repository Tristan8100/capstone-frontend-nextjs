import AlumniLayout from "@/components/layout/alumni-layout"
import PostComponents from "@/components/alumni-components/posts-components"
import { Button } from "@/components/ui/button"
import { Card, CardHeader } from "@/components/ui/card"
import { DialogFooter, DialogHeader } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogTitle,
  DialogTrigger,
  DialogPortal,
  DialogOverlay,
} from "@radix-ui/react-dialog"
import { Separator } from "@radix-ui/react-dropdown-menu"
import { Label } from "@/components/ui/label"
import { CalendarIcon, ImageIcon, UserRound, VideoIcon } from "lucide-react"
import PostCreator from "@/components/create-post"
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar"

export default function Page() {
  return (
    <AlumniLayout currentPage="Community Feed">
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 py-4">
        <div className="flex justify-between items-center max-w-screen-xl mx-auto">
          <h1 className="text-2xl font-bold">Community Feed</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <span>Latest</span>
            </Button>
            <Button variant="outline" size="sm">
              <span>Popular</span>
            </Button>
          </div>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Card className="w-[350px] sm:w-[450px] lg:w-[700px] xl:w-[900px] 2xl:w-[1000px] max-w-screen-xl h-[200px] mx-auto rounded-lg shadow-sm border-border/50 hover:border-primary/30 transition-colors group">
            <div className="flex items-center justify-center p-4">
              <div className="flex items-center w-full max-w-4xl px-4"> {/* Even wider */}
                <Avatar className="mr-4">
                  <AvatarImage src="/user-image.jpg" />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
                  <div className="flex-1 px-6 py-4 rounded-full bg-muted text-muted-foreground cursor-text hover:bg-muted/80 transition-colors duration-200 hover:ring-1 hover:ring-primary text-base">
                    What's on your mind?
                  </div>
              </div>
            </div>
            <div className="flex justify-between pt-3 border-t border-border/50">
              <Button variant="ghost" className="flex-1">
                <ImageIcon className="mr-2 h-4 w-4" /> Photo
              </Button>
              <Button variant="ghost" className="flex-1">
                <CalendarIcon className="mr-2 h-4 w-4" /> Content
              </Button>
            </div>
          </Card>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />

          <DialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] overflow-y-auto max-w-[800px] w-full p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 focus:outline-none bg-background border border-border z-[1001]">
            <DialogHeader>
              <DialogTitle>
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-foreground">Create Post</h3>
                </CardHeader>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <PostCreator />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>

      <Separator className="border-border my-6" />

      <PostComponents />
    </AlumniLayout>
  );
}
