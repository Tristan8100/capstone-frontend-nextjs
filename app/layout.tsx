import type React from "react"
import type { Metadata } from "next"
import "./globals.css"
import { ThemeProvider } from "@/components/theme-provider"
import QueryWrapper from "@/lib/query"
import AuthProviderWrapper from "./authwrapper"
import { Toaster } from "sonner"

export const metadata: Metadata = {
  title: "BTECHLINK",
  description: "Alumni System",
  generator: "Next.js",
  manifest: "/manifest.json",
  keywords: ["btechlink", "alumni", "system", "pwa"],
  authors: [{ name: "BTECHLINK Team" }],
  icons: {
    icon: "/icons/icon-192x192.png",
    shortcut: "/icons/icon-192x192.png",
    apple: "/icons/icon-192x192.png",
  },
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <meta name="application-name" content="BTECHLINK" />
        <meta name="apple-mobile-web-app-capable" content="yes" />
        <meta name="apple-mobile-web-app-status-bar-style" content="default" />
        <meta name="apple-mobile-web-app-title" content="BTECHLINK" />
        <meta name="format-detection" content="telephone=no" />
        <meta name="mobile-web-app-capable" content="yes" />
        <meta name="theme-color" content="#000000" />
        <link rel="apple-touch-icon" href="/static/btechlinklogo.png" />
        <link rel="shortcut icon" href="/static/btechlinklogo.png" />
        <script
          dangerouslySetInnerHTML={{
            __html: `
              if ('serviceWorker' in navigator) {
                window.addEventListener('load', function() {
                  navigator.serviceWorker.register('/sw.js')
                    .then(function(registration) {
                      console.log('SW registered: ', registration);
                    })
                    .catch(function(registrationError) {
                      console.log('SW registration failed: ', registrationError);
                    });
                });
              }
            `,
          }}
        />
      </head>
      <body>
        <QueryWrapper>
          <AuthProviderWrapper>
            <ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
              {children}
              <Toaster position="top-center" />
            </ThemeProvider>
          </AuthProviderWrapper>
        </QueryWrapper>
      </body>
    </html>
  )
}
