import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { TrendingUp, Clock, Filter, XCircle } from "lucide-react" // Added XCircle for Declined
import PostComponents from "@/components/alumni-components/posts-components"
import HeaderCommunity from "@/components/admin-components/header-community"

export default function Page() {
  return (
    <div className="space-y-6">
      <HeaderCommunity currentPage="Pending Posts" />

      {/* Main Content Tabs */}
      <Tabs defaultValue="pending" className="space-y-6">
        <div className="flex items-center justify-between">
          <TabsList className="grid w-full max-w-md grid-cols-2">
            <TabsTrigger value="pending" className="flex items-center gap-2">
              <Clock className="h-4 w-4" />
              Pending
            </TabsTrigger>
            <TabsTrigger value="declined" className="flex items-center gap-2">
              <XCircle className="h-4 w-4 text-red-500" />
              Declined
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
              <PostComponents />
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
              <PostComponents />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="pending" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Clock className="h-4 w-4" />
                <span>Posts waiting for approval</span>
              </div>
            </div>
            <div className="p-4">
              <PostComponents />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="declined" className="space-y-4">
          <div className="rounded-lg border bg-card">
            <div className="border-b p-4">
              <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <XCircle className="h-4 w-4 text-red-500" />
                <span>Declined posts</span>
              </div>
            </div>
            <div className="p-4">
              <PostComponents />
            </div>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}
