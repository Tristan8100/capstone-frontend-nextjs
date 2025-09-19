"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Download, X } from "lucide-react"

interface BeforeInstallPromptEvent extends Event {
  prompt(): Promise<void>
  userChoice: Promise<{ outcome: "accepted" | "dismissed" }>
}

export function PWAInstallPrompt() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null)
  const [showInstallPrompt, setShowInstallPrompt] = useState(false)

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault()
      setDeferredPrompt(e as BeforeInstallPromptEvent)
      setShowInstallPrompt(true)
    }

    window.addEventListener("beforeinstallprompt", handler)

    return () => {
      window.removeEventListener("beforeinstallprompt", handler)
    }
  }, [])

  const handleInstallClick = async () => {
    if (!deferredPrompt) return

    deferredPrompt.prompt()
    const { outcome } = await deferredPrompt.userChoice

    if (outcome === "accepted") {
      console.log("User accepted the install prompt")
    } else {
      console.log("User dismissed the install prompt")
    }

    setDeferredPrompt(null)
    setShowInstallPrompt(false)
  }

  const handleDismiss = () => {
    setShowInstallPrompt(false)
    setDeferredPrompt(null)
  }

  if (!showInstallPrompt) return null

  return (
    <div className="fixed bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-80 bg-card border border-border rounded-lg p-4 shadow-lg z-50">
      <div className="flex items-start justify-between mb-2">
        <div className="flex items-center gap-2">
          <Download className="h-5 w-5 text-primary" />
          <h3 className="font-semibold text-sm">Install App</h3>
        </div>
        <Button variant="ghost" size="sm" onClick={handleDismiss} className="h-6 w-6 p-0">
          <X className="h-4 w-4" />
        </Button>
      </div>
      <p className="text-sm text-muted-foreground mb-3">Install this app on your device for a better experience.</p>
      <div className="flex gap-2">
        <Button onClick={handleInstallClick} size="sm" className="flex-1">
          Install
        </Button>
        <Button onClick={handleDismiss} variant="outline" size="sm">
          Not now
        </Button>
      </div>
    </div>
  )
}
