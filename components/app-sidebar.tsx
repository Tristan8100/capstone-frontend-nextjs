'use client'

import type * as React from "react"
import {
  BarChart3,
  Megaphone,
  ClipboardList,
  Users,
  MessageSquarePlus,
  FileText,
  Settings,
  HelpCircle,
  User,
  LogOut,
  GraduationCap,
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from "@/components/ui/sidebar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { useAuth } from "@/contexts/AuthContext"
import Link from "next/link"
import path from "path"
import { usePathname } from "next/navigation"
import { useIsMobile } from "@/hooks/use-mobile"
import { useSidebar } from "@/components/ui/sidebar"
import { useEffect } from "react"

// Navigation data
const homeNavigation = [
  {
    title: "Announcements",
    url: "/alumni/announcement",
    icon: Megaphone,
  },
  {
    title: "Surveys",
    url: "/alumni/surveys",
    icon: ClipboardList,
  },
]

const communityNavigation = [
  {
    title: "Community Feed",
    url: "/alumni/feed",
    icon: Users,
  },
  {
    title: "My Posts",
    url: "/alumni/my-posts",
    icon: FileText,
  },
]

const generalNavigation = [
  {
    title: "Profile & Settings",
    url: "/alumni/settings",
    icon: Settings,
  },
  {
    title: "Help & Support",
    url: "/alumni/help",
    icon: HelpCircle,
  },
]

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { logout } = useAuth()
  const pathname = usePathname();
  const { setOpenMobile } = useSidebar();

  const isMobile = useIsMobile();

  useEffect(() => {
    if (isMobile) {
      setOpenMobile(false); // force close sidebar
    }
  }, [isMobile, pathname, setOpenMobile]);

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link href="/">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                  <GraduationCap className="size-4" />
                </div>
                <div className="flex flex-col gap-0.5 leading-none">
                  <span className="font-semibold">Alumni Portal</span>
                  <span className="text-xs">BTECHLINK</span>
                </div>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
        {/* Home Section */}
        <SidebarGroup>
          <SidebarGroupLabel>
            Home
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {homeNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Community Section */}
        <SidebarGroup>
          <SidebarGroupLabel>Community</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {communityNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* General Section */}
        <SidebarGroup>
          <SidebarGroupLabel>General</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {generalNavigation.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton isActive={pathname === item.url} asChild>
                    <Link href={item.url}>
                      <item.icon className="size-4" />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton
                  size="lg"
                  className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
                >
                  <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-sidebar-primary text-sidebar-primary-foreground">
                    <User className="size-4" />
                  </div>
                  <div className="flex flex-col gap-0.5 leading-none">
                    <span className="font-semibold">Account</span>
                    <span className="text-xs text-sidebar-foreground/70">Access Account</span>
                  </div>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
                side="bottom"
                align="end"
                sideOffset={4}
              >
                <DropdownMenuItem>
                  <Link href={"/alumni/id"} className="flex items-center w-full gap-2">
                  <User className="size-4" />
                  Alumni ID
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link href={"/alumni/settings"} className="flex items-center w-full gap-2">
                  <Settings className="size-4" />
                  Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem className="text-red-600" onClick={() => logout()} >
                  <LogOut className="size-4"/>
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  )
}
