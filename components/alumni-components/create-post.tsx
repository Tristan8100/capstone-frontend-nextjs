import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ImageIcon, CalendarIcon } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { DialogHeader } from "../ui/dialog";
import PostCreatorAlumni from "./create-post-alumni";

export default function CreatePost() {
  return (
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
                    What&#39;s on your mind?
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
              <PostCreatorAlumni />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
  );
}