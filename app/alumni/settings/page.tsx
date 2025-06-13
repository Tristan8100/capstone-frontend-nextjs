
import UserProfilePage from "@/components/alumni-profile"
import AlumniLayout from "@/components/layout/alumni-layout"
import PostComponents from "@/components/alumni-components/posts-components"
import { User } from "lucide-react"
import { UserSettings } from "@/components/ui/settings"


export default function Page() {

  return (
    <AlumniLayout currentPage="User Profile">
      <UserSettings/>
    </AlumniLayout>
  )
}