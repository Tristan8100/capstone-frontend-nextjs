import UserProfilePage from "@/components/alumni-profile"
import AnnouncementComponent from "@/components/announcement-components"
import AdminLayout from "@/components/layout/admin-layout"
import SurveysList from "@/components/surveys-list"


export default function Page() {
  return (
    <AdminLayout currentPage="Dashboard">
        <SurveysList />
    </AdminLayout>
  )
}