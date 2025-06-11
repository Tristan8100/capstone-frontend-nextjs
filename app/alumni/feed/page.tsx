import AlumniLayout from "@/components/layout/alumni-layout"
import PostComponents from "@/components/posts-components"
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
import { UserRound } from "lucide-react"
import PostCreator from "@/components/create-post"

export default function Page() {
  return (
    <AlumniLayout currentPage="Community Feed">
      <Dialog>
        <DialogTrigger asChild>
          <Card className="w-[350px] sm:w-[450px] lg:w-[700px] xl:w-[1000px] max-w-screen-xl mx-auto p-4 rounded-lg shadow-md">
            <div className="flex items-center gap-4">
              <UserRound size={24} />
              <div
                className="flex-1 px-4 py-2 rounded-full bg-background cursor-text hover:bg-gray-200 focus-within:bg-white focus-within:ring-2 focus-within:ring-blue-500 transition"
                role="textbox"
                tabIndex={0}
              >
                What's on your mind?
              </div>
            </div>
          </Card>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/50" />

          <DialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] overflow-y-auto max-w-[800px] w-full p-6 rounded-md shadow-lg -translate-x-1/2 -translate-y-1/2 focus:outline-none bg-white">
            <DialogHeader>
              <DialogTitle><CardHeader>
                <h3 className="text-xl font-semibold text-foreground">Create Post</h3>
              </CardHeader></DialogTitle>
            </DialogHeader>

            {/* Now the PostCreator will scroll if previews overflow */}
            <PostCreator />
          </DialogContent>
        </DialogPortal>
      </Dialog>
      <Separator className="border" />
      <PostComponents />
    </AlumniLayout>
  )
}

