import ChatUI from "@/components/alumni-components/alumni-chat"
import AlumniLayout from "@/components/layout/alumni-layout"


export default function Page() {
  return (
    <AlumniLayout currentPage="Dashboard">
        <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[1000px]"> {/* Container with max-width */}
          <ChatUI />
        </div>
        </div>
    </AlumniLayout>
  )
}