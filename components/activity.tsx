import { Calendar, MapPin, Users, Briefcase, GraduationCap, Star } from "lucide-react"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export default function AlumniActivityComponent() {
  const recentActivities = [
    {
      id: 1,
      name: "Sarah Johnson",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "got promoted to Senior Developer",
      company: "Tech Corp",
      time: "2 hours ago",
      type: "career",
    },
    {
      id: 2,
      name: "Michael Chen",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "started a new position",
      company: "Innovation Labs",
      time: "1 day ago",
      type: "career",
    },
    {
      id: 3,
      name: "Emily Rodriguez",
      avatar: "/placeholder.svg?height=32&width=32",
      action: "shared a career milestone",
      company: "Design Studio",
      time: "2 days ago",
      type: "achievement",
    },
  ]

  const upcomingEvents = [
    {
      id: 1,
      title: "Alumni Networking Night",
      date: "Dec 15, 2024",
      time: "6:00 PM",
      location: "Downtown Conference Center",
      attendees: 45,
      type: "networking",
    },
    {
      id: 2,
      title: "Career Development Workshop",
      date: "Dec 20, 2024",
      time: "2:00 PM",
      location: "Virtual Event",
      attendees: 28,
      type: "workshop",
    },
    {
      id: 3,
      title: "Annual Alumni Gala",
      date: "Jan 10, 2025",
      time: "7:00 PM",
      location: "Grand Ballroom",
      attendees: 120,
      type: "gala",
    },
  ]

  const stats = [
    { label: "Active Alumni", value: "2,847", icon: Users, color: "text-blue-600" },
    { label: "Job Placements", value: "156", icon: Briefcase, color: "text-green-600" },
    { label: "This Month", value: "23", icon: Calendar, color: "text-purple-600" },
  ]

  return (
    <div className="w-full max-w-md space-y-6">
      {/* Alumni Stats */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <GraduationCap className="h-5 w-5" />
            Alumni Network
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4">
            {stats.map((stat, index) => (
              <div key={index} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                <div className="flex items-center gap-3">
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                  <span className="text-sm font-medium">{stat.label}</span>
                </div>
                <span className={`text-lg font-bold ${stat.color}`}>{stat.value}</span>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Recent Alumni Activities */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Recent Activities</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {recentActivities.map((activity) => (
              <div key={activity.id} className="flex items-start gap-3">
                <Avatar className="h-8 w-8">
                  <AvatarImage src={activity.avatar || "/placeholder.svg"} alt={activity.name} />
                  <AvatarFallback>
                    {activity.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </AvatarFallback>
                </Avatar>
                <div className="flex-1 space-y-1">
                  <p className="text-sm">
                    <span className="font-medium">{activity.name}</span> {activity.action}
                    {activity.company && <span className="text-muted-foreground"> at {activity.company}</span>}
                  </p>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">{activity.time}</span>
                    <Badge variant="secondary" className="text-xs">
                      {activity.type}
                    </Badge>
                  </div>
                </div>
              </div>
            ))}
          </div>
          <Button variant="outline" className="w-full mt-4" size="sm">
            View All Activities
          </Button>
        </CardContent>
      </Card>

      {/* Upcoming Events */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Calendar className="h-5 w-5" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {upcomingEvents.map((event) => (
              <div key={event.id} className="border rounded-lg p-3 hover:bg-muted/50 transition-colors">
                <div className="flex items-start justify-between mb-2">
                  <h4 className="font-medium text-sm">{event.title}</h4>
                  <Badge variant={event.type === "gala" ? "default" : "secondary"} className="text-xs">
                    {event.type}
                  </Badge>
                </div>
                <div className="space-y-1 text-xs text-muted-foreground">
                  <div className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {event.date} at {event.time}
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="h-3 w-3" />
                    {event.location}
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    {event.attendees} attending
                  </div>
                </div>
                <Button size="sm" variant="outline" className="w-full mt-2 text-xs">
                  Register
                </Button>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Featured Alumni */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg flex items-center gap-2">
            <Star className="h-5 w-5" />
            Featured Alumni
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center gap-3 p-3 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg">
              <Avatar className="h-10 w-10">
                <AvatarImage src="/placeholder.svg?height=40&width=40" alt="Featured Alumni" />
                <AvatarFallback>JD</AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <p className="font-medium text-sm">John Davis</p>
                <p className="text-xs text-muted-foreground">CEO at StartupCo</p>
                <p className="text-xs text-muted-foreground">Class of 2018</p>
              </div>
            </div>
            <p className="text-xs text-muted-foreground italic">
              "The alumni network has been instrumental in my career growth. The connections and mentorship
              opportunities are invaluable."
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
