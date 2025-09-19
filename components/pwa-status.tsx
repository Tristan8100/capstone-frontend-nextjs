"use client"

import { useState, useEffect } from "react"
import { Badge } from "@/components/ui/badge"
import { Wifi, WifiOff } from "lucide-react"

export function PWAStatus() {
  const [isOnline, setIsOnline] = useState(true)
  const [isInstalled, setIsInstalled] = useState(false)

  useEffect(() => {
    // Check online status
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener("online", handleOnline)
    window.addEventListener("offline", handleOffline)

    // Check if app is installed (running in standalone mode)
    const checkInstalled = () => {
      const isStandalone = window.matchMedia("(display-mode: standalone)").matches
      const isInWebAppiOS = (window.navigator as any).standalone === true
      setIsInstalled(isStandalone || isInWebAppiOS)
    }

    checkInstalled()

    return () => {
      window.removeEventListener("online", handleOnline)
      window.removeEventListener("offline", handleOffline)
    }
  }, [])

  return (
    <div className="fixed top-4 right-4 flex gap-2 z-40">
      <Badge variant={isOnline ? "default" : "destructive"} className="flex items-center gap-1">
        {isOnline ? <Wifi className="h-3 w-3" /> : <WifiOff className="h-3 w-3" />}
        {isOnline ? "Online" : "Offline"}
      </Badge>
      {isInstalled && (
        <Badge variant="secondary" className="flex items-center gap-1">
          📱 Installed
        </Badge>
      )}
    </div>
  )
}
