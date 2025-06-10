import AnnouncementComponent from "@/components/announcement-components"
import AlumniLayout from "@/components/layout/alumni-layout"


export default function Page() {
  return (
    <AlumniLayout currentPage="Announcements">
      <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening in your alumni network today.</p>
          </div>

          <div className="flex justify-center">
            <div className="lg:col-span-2 space-y-6">
              <div className="space-y-4">
                <h2 className="text-xl font-semibold">Latest Announcements</h2>
                <AnnouncementComponent />
              </div>
            </div>
        </div>
    </AlumniLayout>
  )
}
