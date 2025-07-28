import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, GraduationCap } from "lucide-react"


export default function UserProfilePage({ userData }: { userData: any }) {
  // Nuclear-grade null checks
  const safeProfilePath = userData.profile_path ?? "/default-avatar.jpg"
  const safeCourses = userData.course ?? []
  
  // Name formatting with fallbacks
  const fullName = [
    userData.first_name, 
    userData.middle_name, 
    userData.last_name
  ].filter(Boolean).join(' ') || "Anonymous User"

  const fallbackInitials = [
    userData.first_name?.[0],
    userData.last_name?.[0]
  ].filter(Boolean).join('') || "AU"

  // Date formatting with fallback
  const joinDate = userData.created_at 
    ? new Date(userData.created_at).toLocaleDateString() 
    : "Unknown date"

  return (
    <div className="max-w-4xl mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="rounded-xl shadow">
        <CardHeader className="flex flex-col sm:flex-row gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="w-16 h-16">
              <AvatarImage src={safeProfilePath} />
              <AvatarFallback className="bg-muted">
                {fallbackInitials}
              </AvatarFallback>
            </Avatar>
            <div>
              <h2 className="text-2xl font-bold">{fullName}</h2>
              <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                <CalendarDays className="h-4 w-4" />
                <span>Joined {joinDate}</span>
              </div>
            </div>
          </div>
        </CardHeader>

        <CardContent className="grid gap-4">
          {/* Courses with batch info if available */}
          <Badge key={userData.id} variant="outline" className="gap-1">
            <GraduationCap className="h-3.5 w-3.5" />
            <span>
              {userData.course.name}
            </span>
          </Badge>

          {/* Total Posts */}
          <div className="mt-2">
            <h4 className="text-sm font-medium">Total Posts</h4>
            <p className="text-xl font-bold">
              {userData.total_posts ?? 0}
            </p>
          </div>
        </CardContent>
      </Card>
      <Separator />
    </div>
  )
}