import AnnouncementComponent from "@/components/alumni-components/announcement-components"

export default function Page() {
  return (
    <>
      <div className="flex flex-col space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Welcome back!</h1>
            <p className="text-muted-foreground">Heres whats happening in your alumni network today.</p>
      </div>

      <AnnouncementComponent />
    </>
  )
}
