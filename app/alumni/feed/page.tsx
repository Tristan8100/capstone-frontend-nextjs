
import AlumniLayout from "@/components/layout/alumni-layout"
import PostComponents from "@/components/posts-components"


export default function Page() {
  return (
    <AlumniLayout currentPage="Community Feed">
      <h2 className="text-xl font-semibold">Latest Post</h2>
      <PostComponents />
    </AlumniLayout>
  )
}
