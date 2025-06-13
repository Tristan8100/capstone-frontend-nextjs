import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import PostComponents from "./alumni-components/posts-components"

export default function UserProfilePage() {
  // You can use `params.id` if using dynamic route like [id].tsx
  return (
    <div className="max-w-4xl mx-auto p-6 space-y-6">
      {/* User Info */}
      <Card className="rounded-xl shadow">
        <CardHeader className="flex flex-row items-center gap-4">
          <Avatar className="w-16 h-16">
            <AvatarImage src="/placeholder-user.jpg" />
            <AvatarFallback>AB</AvatarFallback>
          </Avatar>
          <div>
            <h2 className="text-2xl font-bold">Alex Brown</h2>
            <p className="text-muted-foreground">Frontend Developer</p>
          </div>
          <div className="ml-auto">
            <Button variant="outline">Message</Button>
          </div>
        </CardHeader>

        <CardContent className="text-sm text-muted-foreground">
          Passionate developer who loves building UIs and community-based platforms.
        </CardContent>
      </Card>

      <Separator />

      {/* User Posts */}
      <div className="space-y-4">
        <h3 className="text-lg font-semibold">Recent Posts</h3>

      </div>
    </div>
  )
}
