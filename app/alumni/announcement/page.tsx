import AnnouncementComponent from "@/components/alumni-components/announcement-components"
import AlumniLayout from "@/components/layout/alumni-layout"


export default function Page() {
  return (
    <AlumniLayout currentPage="Announcements">
      <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Here's what's happening in your alumni network today.</p>
      </div>

      <AnnouncementComponent />
    </AlumniLayout>
  )
}
