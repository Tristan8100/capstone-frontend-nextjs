import UserProfilePage from "@/components/alumni-profile"
import AnnouncementComponent from "@/components/announcement-components"
import AlumniLayout from "@/components/layout/alumni-layout"


export default function Page() {
  return (
    <AlumniLayout currentPage="Dashboard">

                <UserProfilePage />

    </AlumniLayout>
  )
}
