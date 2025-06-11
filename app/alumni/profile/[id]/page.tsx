
import UserProfilePage from "@/components/alumni-profile"
import AlumniLayout from "@/components/layout/alumni-layout"
import PostComponents from "@/components/posts-components"
import { User } from "lucide-react"


export default function Page() {

  return (
    <AlumniLayout currentPage="User Profile">
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <UserProfilePage/>
      <PostComponents/>
    </AlumniLayout>
  )
}