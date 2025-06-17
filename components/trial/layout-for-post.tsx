import PostComponents from "@/components/alumni-components/posts-components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { MessageSquarePlus, TrendingUp, Clock, Users, Sparkles, Filter } from "lucide-react"

export default function Page() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-white to-blue-50/30">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800">
        <div className="absolute inset-0 bg-black/10"></div>
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_50%,rgba(255,255,255,0.1)_1px,transparent_1px)] [background-size:20px_20px] opacity-30"></div>

        <div className="relative max-w-7xl mx-auto px-6 py-16">
          <div className="text-center">
            <div className="flex items-center justify-center gap-2 mb-4">
              <div className="p-2 bg-white/20 rounded-lg backdrop-blur-sm">
                <Users className="h-6 w-6 text-white" />
              </div>
              <Badge variant="secondary" className="bg-white/20 text-white border-white/30 backdrop-blur-sm">
                <Sparkles className="h-3 w-3 mr-1" />
                Alumni Network
              </Badge>
            </div>

            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">General Discussions</h1>
            <p className="text-xl text-blue-100 max-w-2xl mx-auto mb-8">
              Connect with fellow alumni, share experiences, and build lasting professional relationships
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              <Button size="lg" className="bg-white text-blue-600 hover:bg-blue-50 shadow-lg">
                <MessageSquarePlus className="h-5 w-5 mr-2" />
                Start New Discussion
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
              >
                <Filter className="h-5 w-5 mr-2" />
                Filter Posts
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Stats Bar */}
      <div className="bg-white border-b shadow-sm">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex flex-wrap items-center justify-center gap-8 text-sm text-muted-foreground">
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="font-medium">1,247 Active Members</span>
            </div>
            <div className="flex items-center gap-2">
              <MessageSquarePlus className="h-4 w-4" />
              <span>342 Discussions This Month</span>
            </div>
            <div className="flex items-center gap-2">
              <TrendingUp className="h-4 w-4" />
              <span>89% Response Rate</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-6 py-8">
        <Tabs defaultValue="latest" className="w-full">
          {/* Enhanced Tabs Header */}
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6 mb-8">
            <div className="space-y-2">
              <TabsList className="bg-white shadow-sm border h-12 p-1 rounded-xl">
                <TabsTrigger
                  value="latest"
                  className="px-6 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <Clock className="h-4 w-4 mr-2" />
                  Latest Posts
                </TabsTrigger>
                <TabsTrigger
                  value="popular"
                  className="px-6 py-2.5 text-sm font-medium rounded-lg data-[state=active]:bg-blue-600 data-[state=active]:text-white data-[state=active]:shadow-md transition-all duration-200"
                >
                  <TrendingUp className="h-4 w-4 mr-2" />
                  Popular
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center gap-3">
              <Badge variant="outline" className="px-3 py-1.5">
                <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
                24 new posts today
              </Badge>
            </div>
          </div>

          {/* Content Areas */}
          <div className="grid lg:grid-cols-4 gap-8">
            {/* Main Content */}
            <div className="lg:col-span-3 min-w-0 overflow-hidden">
              <TabsContent value="latest" className="focus-visible:outline-none mt-0">
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-slate-50 to-blue-50/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Latest Discussions</h2>
                      <Badge variant="secondary" className="bg-blue-100 text-blue-700">
                        Updated 2 min ago
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="w-full overflow-x-auto">
                      <div className="max-w-full">
                        <PostComponents />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="popular" className="focus-visible:outline-none mt-0">
                <div className="bg-white rounded-2xl shadow-sm border overflow-hidden">
                  <div className="p-6 border-b bg-gradient-to-r from-orange-50 to-red-50/50">
                    <div className="flex items-center justify-between">
                      <h2 className="text-lg font-semibold text-foreground">Trending Discussions</h2>
                      <Badge variant="secondary" className="bg-orange-100 text-orange-700">
                        <TrendingUp className="h-3 w-3 mr-1" />
                        Hot Topics
                      </Badge>
                    </div>
                  </div>
                  <div className="p-6">
                    <div className="w-full overflow-x-auto">
                      <div className="max-w-full">
                        <PostComponents />
                      </div>
                    </div>
                  </div>
                </div>
              </TabsContent>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1 space-y-6">
              {/* Quick Stats */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold text-foreground mb-4">Community Stats</h3>
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Total Posts</span>
                    <span className="font-semibold">2,847</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Active Today</span>
                    <span className="font-semibold text-green-600">156</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">Response Rate</span>
                    <span className="font-semibold text-blue-600">89%</span>
                  </div>
                </div>
              </div>

              {/* Popular Topics */}
              <div className="bg-white rounded-2xl shadow-sm border p-6">
                <h3 className="font-semibold text-foreground mb-4">Popular Topics</h3>
                <div className="space-y-3">
                  {[
                    { name: "Career Advice", count: 45, color: "bg-blue-100 text-blue-700" },
                    { name: "Networking", count: 32, color: "bg-green-100 text-green-700" },
                    { name: "Industry News", count: 28, color: "bg-purple-100 text-purple-700" },
                    { name: "Job Opportunities", count: 24, color: "bg-orange-100 text-orange-700" },
                  ].map((topic) => (
                    <div key={topic.name} className="flex items-center justify-between">
                      <span className="text-sm text-muted-foreground">{topic.name}</span>
                      <Badge variant="secondary" className={topic.color}>
                        {topic.count}
                      </Badge>
                    </div>
                  ))}
                </div>
              </div>

              {/* Call to Action */}
              <div className="bg-gradient-to-br from-blue-600 to-purple-600 rounded-2xl p-6 text-white">
                <h3 className="font-semibold mb-2">Share Your Story</h3>
                <p className="text-sm text-blue-100 mb-4">
                  Help fellow alumni by sharing your career journey and insights.
                </p>
                <Button size="sm" className="bg-white text-blue-600 hover:bg-blue-50 w-full">
                  Create Post
                </Button>
              </div>
            </div>
          </div>
        </Tabs>
      </div>
    </div>
  )
}
