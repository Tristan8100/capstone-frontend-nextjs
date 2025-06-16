
import UserProfilePage from "@/components/alumni-profile"
import PostComponents from "@/components/alumni-components/posts-components"



export default function Page() {

  return (
    <>
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <UserProfilePage/>
      <PostComponents/>
    </>
  )
}