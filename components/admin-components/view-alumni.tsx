import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem } from "@/components/ui/dropdown-menu"

export default function ViewAlumni() {
  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      {/* User Info */}
      <Card className="rounded-xl shadow">
        <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
          <div className="flex items-center gap-4 w-full sm:w-auto">
            <Avatar className="w-12 h-12 sm:w-16 sm:h-16">
              <AvatarImage src="/placeholder-user.jpg" />
              <AvatarFallback>AB</AvatarFallback>
            </Avatar>
            <div className="flex-1 sm:flex-none">
              <h2 className="text-xl sm:text-2xl font-bold">Alex Brown</h2>
              <p className="text-sm sm:text-base text-muted-foreground">Frontend Developer</p>
            </div>
          </div>
          <div className="w-full sm:w-auto sm:ml-auto">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="w-full sm:w-auto">
                  Options
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>Message</DropdownMenuItem>
                <DropdownMenuItem>Connect</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </CardHeader>

        <CardContent className="text-xs sm:text-sm text-muted-foreground">
          Passionate developer who loves building UIs and community-based platforms.
        </CardContent>
      </Card>

      <Separator />

      {/* User Posts */}
      <div className="space-y-4">
        <h3 className="text-base sm:text-lg font-semibold">Recent Posts</h3>
        {/* Post content would go here */}
      </div>
    </div>
  )
}