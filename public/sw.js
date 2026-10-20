const CACHE = 'bangke-v2'
const scope = self.registration.scope
const CORE = [scope, `${scope}showcase/`, `${scope}manifest.webmanifest`, `${scope}shell-icon.svg`]

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(CORE)))
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(keys.filter((key) => key.startsWith('bangke-') && key !== CACHE).map((key) => caches.delete(key)))))
  self.clients.claim()
})

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url)
  if (event.request.method !== 'GET' || url.origin !== self.location.origin || !url.href.startsWith(scope)) return
  event.respondWith((async () => {
    const cache = await caches.open(CACHE)
    try {
      const response = await fetch(event.request)
      if (response.ok) await cache.put(event.request, response.clone())
      return response
    } catch {
      const cached = await cache.match(event.request)
      if (cached) return cached
      if (event.request.mode === 'navigate') return (await cache.match(url.pathname.includes('/showcase') ? `${scope}showcase/` : scope)) || Response.error()
      return Response.error()
    }
  })())
})
