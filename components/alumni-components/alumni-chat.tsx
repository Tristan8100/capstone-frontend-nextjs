import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

export default function ChatUI() {
  return (
    <div className="flex flex-col border bg-background h-[calc(100vh-200px)]"> {/* Removed fixed positioning */}
      {/* Scrollable chat area */}
      <ScrollArea className="flex-1 p-4 overflow-y-auto space-y-4">
        {/* Example message from other user */}
        <div className="flex items-start gap-3">
          <Avatar>
            <AvatarImage src="/user1.png" alt="User" />
            <AvatarFallback>U1</AvatarFallback>
          </Avatar>
          <div>
            <div className="bg-muted rounded-lg p-3 text-sm">
              Hey, how can I help you today?
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">10:30 AM</span>
          </div>
        </div>

        {/* Example message from you */}
        <div className="flex items-start gap-3 justify-end text-right">
          <div>
            <div className="bg-primary text-primary-foreground rounded-lg p-3 text-sm">
              I have a question about my order.
            </div>
            <span className="text-xs text-muted-foreground mt-1 block">10:32 AM</span>
          </div>
          <Avatar>
            <AvatarImage src="/user2.png" alt="You" />
            <AvatarFallback>Me</AvatarFallback>
          </Avatar>
        </div>
      </ScrollArea>

      {/* Chat input area */}
      <form className="w-full p-4 border-t bg-background flex gap-2">
        <Input placeholder="Type a message..." className="flex-1" />
        <Button type="submit">Send</Button>
      </form>
    </div>
  );
}
