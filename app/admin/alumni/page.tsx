import { AlumniTable } from "@/components/admin-components/alumni-list"
import UserProfilePage from "@/components/alumni-profile"
import AnnouncementComponent from "@/components/announcement-components"
import AdminLayout from "@/components/layout/admin-layout"
import SurveysList from "@/components/surveys-list"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"


export default function Page() {
  return (
    <AdminLayout currentPage="Alumni List">
      <div className="flex justify-between items-center mb-4">
            <div>
                <h1 className="text-2xl font-bold">Alumni List</h1>
                <p className="text-muted-foreground">Manage and Upload new Alumni List</p>
            </div>
            <Button variant="outline" size="sm" className="mb-2">
                Import
            </Button>
      </div>
        <Separator/>
        <AlumniTable />
    </AdminLayout>
  )
}