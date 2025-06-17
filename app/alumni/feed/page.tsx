
import PostComponents from "@/components/alumni-components/posts-components"
import { Button } from "@/components/ui/button"
import { Separator } from "@radix-ui/react-dropdown-menu"
import CreatePost from "@/components/alumni-components/create-post"

export default function Page() {
  return (
    <>
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
    </>
  );
}
