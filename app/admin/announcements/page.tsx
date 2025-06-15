import { AccountTable } from "@/components/admin-components/account-list"
import { ExcelUploadModal } from "@/components/admin-components/upload-alumni"
import UserProfilePage from "@/components/alumni-profile"
import AnnouncementComponent from "@/components/alumni-components/announcement-components"
import AdminLayout from "@/components/layout/admin-layout"
import SurveysList from "@/components/surveys-list"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import CreateAnnouncement from "@/components/admin-components/create-announcement"


export default function Page() {
  return (
    <AdminLayout currentPage="Accounts">
      <CreateAnnouncement />
    </AdminLayout>
  )
}