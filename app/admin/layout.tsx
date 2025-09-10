'use client'
import { usePathname, useRouter } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';
import { useAuth, User } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { useEffect, useState } from "react";

export default function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const router = useRouter();
    const { user, setUser, logout } = useAuth();

    useEffect(() => {
        const verifyUser = async () => {
            try {
                const res = await api.get<{ user_info: User }>("/api/verify-admin");
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

    const currentPage = (() => {
        if (pathname.includes('/admin/dashboard')) return ['Dashboard', 'dashboard'];
        if (pathname.includes('/admin/settings')) return ['Settings', 'settings'];
        if (pathname.includes('/admin/surveys')) return ['Surveys', 'surveys'];
        if (pathname.includes('/admin/surveys/{id}')) return ['Surveys', 'surveys'];
        if (pathname.includes('/admin/alumni')) return ['Alumni List', 'alumni'];
        if (pathname.includes('/admin/accounts')) return ['Accounts', 'accounts'];
        if (pathname.includes('/admin/general')) return ['Programs and Institutes', 'general'];
        if (pathname.includes('/admin/announcement')) return ['Announcements', 'announcement'];
        if (pathname.includes('/admin/community-posts')) return ['Community Posts', 'community-posts'];
        if (pathname.includes('/admin/community-pending')) return ['Posts Pending Approval', 'community-pending'];
        if (pathname.includes('/admin/community-chat')) return ['Chat Support', 'community-chat'];
        if (pathname.includes('/admin/jobfit')) return ['Job-fit Analysis', 'jobfit'];
        return ['Admin', 'dashboard'];
    })();

    return (
        <AdminLayout currentPage={currentPage}>
            {children}
        </AdminLayout>
    );
}
