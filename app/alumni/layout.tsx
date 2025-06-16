'use client'
import { usePathname } from 'next/navigation';
import AlumniLayout from '@/components/layout/alumni-layout';


export default function AlumniLayoutComponent({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

  const currentPage = (() => {
    if (pathname.includes('/alumni/dashboard')) return 'Dashboard';
    if (pathname.includes('/alumni/settings')) return 'Settings';
    return 'Alumni';
  })();
  return (
    <AlumniLayout currentPage={currentPage}>
      {children}
    </AlumniLayout>
  );
}