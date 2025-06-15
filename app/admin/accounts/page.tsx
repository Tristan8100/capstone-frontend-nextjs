import { AccountTable } from "@/components/admin-components/account-list"
import { ExcelUploadModal } from "@/components/admin-components/upload-alumni"
import UserProfilePage from "@/components/alumni-profile"
import AnnouncementComponent from "@/components/announcement-components"
import AdminLayout from "@/components/layout/admin-layout"
import SurveysList from "@/components/surveys-list"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


export default function Page() {
  return (
    <AdminLayout currentPage="Accounts">
      <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold">Alumni Accounts</h1>
                <p className="text-muted-foreground">Manage Accounts</p>
            </div>
      </div>
        <Separator/>
        <AccountTable />
    </AdminLayout>
  )
}