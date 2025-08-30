import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { CalendarDays, GraduationCap, Mail, Bookmark, FileText } from "lucide-react"
import { Heart } from "lucide-react"


export default function UserProfilePage({ userData }: { userData: any }) {
  // Nuclear-grade null checks
  const safeProfilePath = userData.profile_path ?? "/default-avatar.jpg"
  const safeCourses = userData.course ?? []
  const safeBatch = userData.batch ?? "N/A"
  const safeEmail = userData.email ?? "No email provided"
  
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
    ? new Date(userData.created_at).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      }) 
    : "Unknown date"

  return (
    <div className="mx-auto p-4 sm:p-6 space-y-4 sm:space-y-6">
      <Card className="rounded-xl shadow-lg">
        <CardHeader className="flex flex-col sm:flex-row gap-4 sm:gap-6 md:gap-8 items-center">
  {/* Avatar */}
  <div className="flex items-center justify-center">
    <Avatar className="w-20 h-20 sm:w-24 sm:h-24 md:w-32 md:h-32 border-2 border-primary/10">
      <AvatarImage src={safeProfilePath} />
      <AvatarFallback className="bg-muted text-2xl font-medium">
        {fallbackInitials}
      </AvatarFallback>
    </Avatar>
  </div>

  {/* User Info */}
  <div className="space-y-1.5 text-center sm:text-left">
    <h2 className="text-2xl sm:text-3xl md:text-4xl font-bold tracking-tight">{fullName}</h2>
    <div className="flex flex-wrap justify-center sm:justify-start items-center gap-2 text-sm text-muted-foreground">
      <div className="flex items-center gap-1.5">
        <CalendarDays className="h-4 w-4" />
        <span>Joined {joinDate}</span>
      </div>
      <Separator orientation="vertical" className="h-4" />
      <div className="flex items-center gap-1.5">
        <Mail className="h-4 w-4" />
        <span>{safeEmail}</span>
      </div>
    </div>
  </div>
</CardHeader>


        <Separator className="mb-4" />

        <CardContent className="grid gap-6">
          {/* Academic Information Section */}
          <div className="space-y-3">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <GraduationCap className="h-5 w-5 text-primary" />
              Academic Information
            </h3>
            <div className="flex flex-wrap gap-3">
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <Bookmark className="h-4 w-4" />
                <span>
                  {userData.course?.name || "No course specified"}
                </span>
              </Badge>
              
              <Badge variant="secondary" className="gap-1.5 py-1.5 px-3">
                <GraduationCap className="h-4 w-4" />
                <span>Batch {safeBatch}</span>
              </Badge>
            </div>
          </div>

          {/* Activity Stats */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Total Posts</h4>
              </div>
              <p className="text-2xl font-bold mt-2">
                {userData.total_posts ?? 0}
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Likes Given</h4>
              </div>
              <p className="text-2xl font-bold mt-2">
                {userData.total_likes_given ?? 0}
              </p>
            </div>
            
            <div className="rounded-lg border p-4">
              <div className="flex items-center gap-3">
                <Heart className="h-5 w-5 text-primary" />
                <h4 className="text-sm font-medium">Likes Received</h4>
              </div>
              <p className="text-2xl font-bold mt-2">
                {userData.total_likes_received ?? 0}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}