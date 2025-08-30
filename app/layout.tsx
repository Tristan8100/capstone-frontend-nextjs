import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider"
import QueryWrapper from '@/lib/query';
import AuthProviderWrapper from "./authwrapper";
import { Toaster } from 'sonner'
export const metadata: Metadata = {
  title: "BTECHLINK",
  description: "Alumni System",
  icons: {
    icon: "/static/btechlinklogo.png",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body>
          <QueryWrapper>
            <AuthProviderWrapper>
              <ThemeProvider
                attribute="class"
                defaultTheme="system"
                enableSystem
                disableTransitionOnChange
              >
                {children}
                <Toaster position="top-center" />
              </ThemeProvider>
            </AuthProviderWrapper>
          </QueryWrapper>
      </body>
    </html>
  );
}
