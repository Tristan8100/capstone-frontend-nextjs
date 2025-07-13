'use client'
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
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

export default function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
  
  const router = useRouter();
    const { user, setUser, logout } = useAuth();
  
    useEffect(() => {
      const token = localStorage.getItem("token");
      
      if (!token) {
        router.push("/login");
        return;
      }
  
      const verifyUser = async () => {
        try {
          const res = await api.get<{ user_info: User }>("/api/verify-admin", { //different routes na
            headers: { Authorization: `Bearer ${token}` }
          });
          
          setUser(res.data.user_info);
          console.log("User set:", res.data.user_info); // por debugging again
        } catch (error) {
          console.error("Verification failed:", error);
          localStorage.removeItem("token");
          setUser(null);
          router.push("/login");
        }
      };
  
      verifyUser();
    }, [router, setUser]);
  
    // Por debugging
    useEffect(() => {
      console.log("User state updated:", user);
    }, [user]);
  
    if (!user) {
      // This will trigger if verification fails
      return null;
    }

  const currentPage = (() => {
    if (pathname.includes('/admin/dashboard')) return 'Dashboard';
    if (pathname.includes('/admin/settings')) return 'Settings';
    return 'Admin';
  })();
  return (
    <AdminLayout currentPage={currentPage}>
      {children}
    </AdminLayout>
  );
}


