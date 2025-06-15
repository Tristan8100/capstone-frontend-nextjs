import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Dialog, DialogTrigger, DialogPortal, DialogOverlay, DialogContent, DialogTitle } from "@radix-ui/react-dialog";
import { ImageIcon, CalendarIcon } from "lucide-react";
import PostCreator from "../create-post";
import { Button } from "../ui/button";
import { Card, CardHeader } from "../ui/card";
import { DialogHeader } from "../ui/dialog";

export default function CreateAnnouncement() {
  return (
    <Dialog>
        <DialogTrigger asChild>
          <Button>Create Announcement</Button>
        </DialogTrigger>

        <DialogPortal>
          <DialogOverlay className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[1000]" />

          <DialogContent className="fixed top-1/2 left-1/2 max-h-[90vh] overflow-y-auto max-w-[800px] w-full p-6 rounded-lg shadow-lg -translate-x-1/2 -translate-y-1/2 focus:outline-none bg-background border border-border z-[1001]">
            <DialogHeader>
              <DialogTitle>
                <CardHeader>
                  <h3 className="text-2xl font-semibold text-foreground">Create Announcement</h3>
                </CardHeader>
              </DialogTitle>
            </DialogHeader>

            <div className="mt-4">
              <PostCreator />
            </div>
          </DialogContent>
        </DialogPortal>
      </Dialog>
  );
}