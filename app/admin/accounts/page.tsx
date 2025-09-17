import { AccountTable } from "@/components/admin-components/account-list"
import { Separator } from "@/components/ui/separator"

export default function Page() {
  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <div>
          <h1 className="text-2xl font-bold">Alumni Accounts</h1>
          <p className="text-muted-foreground">Manage Accounts</p>
        </div>
      </div>
      <Separator className="my-4" />
      <AccountTable />
    </div>
  )
}
