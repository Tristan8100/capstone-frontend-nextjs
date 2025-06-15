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
import CreatePost from "@/components/alumni-components/create-post"

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
      <CreatePost />

      <Separator className="border-border my-6" />

      <PostComponents />
    </AlumniLayout>
  );
}
