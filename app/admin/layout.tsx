'use client'
import { usePathname } from 'next/navigation';
import AdminLayout from '@/components/layout/admin-layout';


export default function AdminLayoutComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

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


