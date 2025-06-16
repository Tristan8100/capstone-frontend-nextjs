import PostComponents from "@/components/alumni-components/posts-components"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@radix-ui/react-tabs"



export default function Page() {
  return (
    <>
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
                    <PostComponents /> {/* change to authenticated user's posts */ }
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
    </>
  )
}
