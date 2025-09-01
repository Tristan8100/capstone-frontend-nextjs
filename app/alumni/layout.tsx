"use client";

import { usePathname, useRouter } from "next/navigation";
import AlumniLayout from "@/components/layout/alumni-layout";
import { useAuth, User } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useEffect } from "react";


export default function AlumniLayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuth();

  useEffect(() => {

    const verifyUser = async () => {
      try {
        const res = await api.get<{ user_info: User }>("/api/verify-user");
        
        setUser(res.data.user_info);
        console.log("User set:", res.data.user_info); // por debugging again
      } catch (error) {
        console.error("Verification failed:", error);
        setUser(null);
        router.push("/login");
      }
    };

    verifyUser();
  }, [pathname, router, setUser]);

  // Por debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!user) {
    // This will trigger if verification fails
    return null;
  }

  const currentPage = (() => {
    if (pathname.includes("/alumni/dashboard")) return "Dashboard";
    if (pathname.includes("/alumni/settings")) return "Settings";
    if (pathname.includes("/alumni/feed")) return "Community Feed";
    if (pathname.includes("/alumni/announcements")) return "Announcements";
    if (pathname.includes("/alumni/surveys")) return "Surveys";
    if (pathname.includes("/alumni/my-posts")) return "My Posts";
    if (pathname.includes("/alumni/help")) return "Help and Support";
    if (pathname.includes("/alumni/id")) return "Alumni ID";
    return "Alumni";
  })();

  return <AlumniLayout currentPage={currentPage}>{children}</AlumniLayout>;
}