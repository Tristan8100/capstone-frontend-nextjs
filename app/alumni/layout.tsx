"use client";

import { usePathname, useRouter } from "next/navigation";
import AlumniLayout from "@/components/layout/alumni-layout";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

type User = {
  id: number;
  name: string;
  email: string;
  course: string | null;
  qr_code_path: string | null;
};


export default function AlumniLayoutComponent({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const { user, setUser, logout } = useAuth();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem("token");
    
    if (!token) {
      router.push("/login");
      return;
    }

    const verifyUser = async () => {
      try {
        const res = await api.get<{ user_info: User }>("/api/verify-user", {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        setUser(res.data.user_info);
        console.log("User set:", res.data.user_info); // por debugging again
      } catch (error) {
        console.error("Verification failed:", error);
        localStorage.removeItem("token");
        setUser(null);
        router.push("/login");
      } finally {
        setIsReady(true);
      }
    };

    verifyUser();
  }, [router, setUser]);

  // Por debugging
  useEffect(() => {
    console.log("User state updated:", user);
  }, [user]);

  if (!isReady) return <div>Loading...</div>; // Better loading state

  if (!user) {
    // This will trigger if verification fails
    return null;
  }

  const currentPage = (() => {
    if (pathname.includes("/alumni/dashboard")) return "Dashboard";
    if (pathname.includes("/alumni/settings")) return "Settings";
    return "Alumni";
  })();

  return <AlumniLayout currentPage={currentPage}>{children}</AlumniLayout>;
}