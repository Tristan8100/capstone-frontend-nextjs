import AnnouncementComponent from "@/components/announcement-components"
import { AppSidebar } from "@/components/app-sidebar"
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb"
import { Separator } from "@/components/ui/separator"
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"
import { ModeToggle } from "@/components/mode-toggle"
import PostComponents from "@/components/posts-components"
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@radix-ui/react-tabs"


export default function Page() {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="sticky top-0 z-50 flex h-16 shrink-0 items-center gap-2 border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem className="hidden md:block">
                  <BreadcrumbLink href="#">Alumni Portal</BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator className="hidden md:block" />
                <BreadcrumbItem>
                  <BreadcrumbPage>Dashboard</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>
          </div>
          <div className="ml-auto mr-4">
            <ModeToggle />
          </div>
        </header>

        <main className="flex-1 space-y-6 p-6">
            <div className="flex justify-center w-full">
                <Tabs defaultValue="published" className="w-full max-w-4xl">
                <TabsList className="grid w-full grid-cols-3 rounded-lg shadow-md bg-muted mb-6">
                    <TabsTrigger
                        value="published"
                        className="py-2 px-4 text-center rounded-md transition-all duration-200
                                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
                                hover:bg-accent hover:text-accent-foreground"
                    >
                        Published
                    </TabsTrigger>
                    <TabsTrigger
                        value="pending"
                        className="py-2 px-4 text-center rounded-md transition-all duration-200
                                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
                                hover:bg-accent hover:text-accent-foreground"
                    >
                        Pending
                    </TabsTrigger>
                    <TabsTrigger
                        value="declined"
                        className="py-2 px-4 text-center rounded-md transition-all duration-200
                                data-[state=active]:bg-primary data-[state=active]:text-primary-foreground data-[state=active]:shadow-sm
                                hover:bg-accent hover:text-accent-foreground"
                    >
                        Declined
                    </TabsTrigger>
                </TabsList>

                <TabsContent className="flex justify-center" value="published">
                    <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Published Posts</h2>
                    <p className="text-muted-foreground">Content for Published posts goes here.</p>
                    <PostComponents />
                    </div>
                </TabsContent>

                <TabsContent className="flex justify-center" value="pending">
                    <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Pending Posts</h2>
                    <p className="text-muted-foreground">Content for Pending posts goes here.</p>
                    <PostComponents />
                    </div>
                </TabsContent>

                <TabsContent className="flex justify-center" value="declined">
                    <div className="space-y-4">
                    <h2 className="text-xl font-semibold text-foreground">Declined Posts</h2>
                    <p className="text-muted-foreground">Content for Declined posts goes here.</p>
                    </div>
                </TabsContent>
                </Tabs>
            </div>
            </main>
      </SidebarInset>
    </SidebarProvider>
  )
}