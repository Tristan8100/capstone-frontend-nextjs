'use client';

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
        console.log("User set:", res.data.user_info); // for debugging
      } catch (error) {
        console.error("Verification failed:", error);
        setUser(null);
        router.push("/login");
      }
    };

    verifyUser();
  }, [pathname, router, setUser]);

  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!user) return null;

  const currentPage: [string, string] = (() => {
    if (pathname.includes("/alumni/dashboard")) return ["Dashboard", "dashboard"];
    if (pathname.includes("/alumni/settings")) return ["Settings", "settings"];
    if (pathname.includes("/alumni/feed")) return ["Community Feed", "feed"];
    if (pathname.includes("/alumni/announcements")) return ["Announcements", "announcements"];
    if (pathname.includes("/alumni/surveys")) return ["Surveys", "surveys"];
    if (pathname.includes("/alumni/my-posts")) return ["My Posts", "my-posts"];
    if (pathname.includes("/alumni/help")) return ["Help and Support", "help"];
    if (pathname.includes("/alumni/id")) return ["Alumni ID", "id"];
    return ["Alumni", "announcement"];
  })();

  return <AlumniLayout currentPage={currentPage}>{children}</AlumniLayout>;
}
