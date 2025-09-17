import { AlumniTable } from "@/components/admin-components/alumni-list"
import { ExcelUploadModal } from "@/components/admin-components/upload-alumni"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Alumni List</h1>
          <p className="text-muted-foreground">Manage and Upload new Alumni List</p>
        </div>
        <ExcelUploadModal />
      </div>
      <Separator className="my-4" />
      <AlumniTable />
    </div>
  )
}
