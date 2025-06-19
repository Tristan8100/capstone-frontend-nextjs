import AdminChatUI from "@/components/admin-components/admin-chat"
import { CommandShortcut } from "@/components/ui/command"
import { Command, CommandInput, CommandList, CommandEmpty, CommandGroup, CommandItem, CommandSeparator } from "@/components/ui/command";
import { Avatar, AvatarImage, AvatarFallback } from "@radix-ui/react-avatar";
import { Calendar, Smile, Calculator, User, CreditCard, Settings } from "lucide-react"
import Link from "next/link";

export default function Page() {
  return (
    <>
        <div className="flex flex-col items-center justify-center p-4 grid grid-cols-3 border">
            <div className="col-span-2">
                <AdminChatUI/>
            </div>
            <div className="border border-red-500 h-[calc(100vh-200px)] p-4">
                <Command className="rounded-lg border shadow-md">
                    <CommandInput placeholder="Search users..." />
                    <CommandList>
                        <CommandEmpty>No users found.</CommandEmpty>

                        {/* John Doe */}
                        <CommandItem asChild>
                        <Link
                            href="/admin/chat/john"
                            className="flex items-center gap-4 p-2 w-full hover:bg-accent transition rounded-md"
                        >
                            <Avatar>
                            <AvatarImage src="/user-profile.png" alt="John" />
                            <AvatarFallback>JD</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                            <span className="font-medium">John Doe</span>
                            <span className="text-xs text-muted-foreground truncate">
                                Hey, how are you?
                            </span>
                            </div>
                        </Link>
                        </CommandItem>

                        {/* Jane Alvarez */}
                        <CommandItem asChild>
                        <Link
                            href="/admin/chat/jane"
                            className="flex items-center gap-4 p-2 w-full hover:bg-accent transition rounded-md"
                        >
                            <Avatar>
                            <AvatarImage src="/jane-profile.png" alt="Jane" />
                            <AvatarFallback>JA</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                            <span className="font-medium">Jane Alvarez</span>
                            <span className="text-xs text-muted-foreground truncate">
                                Let’s meet later today!
                            </span>
                            </div>
                        </Link>
                        </CommandItem>

                        {/* Michael Green */}
                        <CommandItem asChild>
                        <Link
                            href="/admin/chat/michael"
                            className="flex items-center gap-4 p-2 w-full hover:bg-accent transition rounded-md"
                        >
                            <Avatar>
                            <AvatarImage src="/michael-profile.png" alt="Michael" />
                            <AvatarFallback>MG</AvatarFallback>
                            </Avatar>
                            <div className="flex flex-col">
                            <span className="font-medium">Michael Green</span>
                            <span className="text-xs text-muted-foreground truncate">
                                Got your message!
                            </span>
                            </div>
                        </Link>
                        </CommandItem>
                    </CommandList>
                </Command>
            </div>
        </div>
    </>
  )
}