'use client'

import ChatPage from "@/components/chat-component";
import PreviousConversations from "@/components/previous-conversations";
import { useParams } from "next/navigation";

export default function Page() {

  return (
    <>
      <div className="flex md:flex-row flex-col">
        <div className="flex-1">
          <ChatPage />
        </div>
        <div className="hidden lg:block w-[350px]">
          <PreviousConversations/>
        </div>
      </div>
    </>
  )
}