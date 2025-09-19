const CACHE_NAME = "nextjs-pwa-v1"
const urlsToCache = ["/", "/manifest.json", "/icons/icon-192x192.png", "/icons/icon-512x512.png"]

// Install event - cache resources
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      console.log("Opened cache")
      return cache.addAll(urlsToCache)
    }),
  )
})

function shouldCache(request) {
  const url = new URL(request.url)

  // Don't cache Next.js chunks, hot-reload, or API routes
  if (
    url.pathname.includes("/_next/static/chunks/") ||
    url.pathname.includes("/_next/static/css/") ||
    url.pathname.includes("/_next/webpack-hmr") ||
    url.pathname.startsWith("/api/") ||
    url.pathname.includes("hot-update")
  ) {
    return false
  }

  return true
}

// Fetch event - serve cached content when offline
// self.addEventListener("fetch", (event) => {
//   if (!shouldCache(event.request)) {
//     return // Let the request go through normally
//   }

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return cached version or fetch from network
//       if (response) {
//         return response
//       }
//       return fetch(event.request)
//     }),
//   )
// })

// Activate event - clean up old caches
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME) {
            console.log("Deleting old cache:", cacheName)
            return caches.delete(cacheName)
          }
        }),
      )
    }),
  )
})
