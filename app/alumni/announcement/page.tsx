import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardHeader } from "@/components/ui/card"
import { TrendingUp, Clock, Filter, Search} from "lucide-react"
import AnnouncementComponents from "@/components/alumni-components/announcement-components"
import HeaderAnnouncement from "@/components/admin-components/header-announcement"
export default function Page() {
  return (
    <div className="space-y-6">

      {/* Main Content Tabs */}
      <Tabs defaultValue="latest" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="latest" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Latest
            </TabsTrigger>
            <TabsTrigger value="popular" className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              Popular
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="latest" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Latest posts from your network</span>
              </div>
            </div>
            <div className="p-4">
              <AnnouncementComponents />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="popular" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <TrendingUp className="h-4 w-4" />
                <span>Most engaging posts this week</span>
              </div>
            </div>
            <div className="p-4">
              <AnnouncementComponents />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
