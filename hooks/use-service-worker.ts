"use client"

import { useEffect, useState } from "react"

export function useServiceWorker() {
  const [registration, setRegistration] = useState<ServiceWorkerRegistration | null>(null)
  const [isSupported, setIsSupported] = useState(false)
  const [isRegistered, setIsRegistered] = useState(false)

  useEffect(() => {
    if ("serviceWorker" in navigator) {
      setIsSupported(true)

      navigator.serviceWorker
        .register("/sw.js")
        .then((registration) => {
          console.log("Service Worker registered successfully:", registration)
          setRegistration(registration)
          setIsRegistered(true)
        })
        .catch((error) => {
          console.log("Service Worker registration failed:", error)
        })
    }
  }, [])

  return {
    registration,
    isSupported,
    isRegistered,
  }
}
