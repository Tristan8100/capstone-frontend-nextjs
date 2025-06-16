import ChatUI from "@/components/alumni-components/alumni-chat"

export default function Page() {
  return (
    <>
        <div className="flex flex-col items-center justify-center p-4">
        <div className="w-full max-w-[1000px]"> {/* Container with max-width */}
          <ChatUI />
        </div>
        </div>
    </>
  )
}