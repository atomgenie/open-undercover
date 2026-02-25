const CACHE_NAME = "open-undercover-v3"
const STATIC_ASSETS = ["/", "/manifest.json"]

self.addEventListener("install", event => {
    event.waitUntil(
        caches.open(CACHE_NAME).then(cache => cache.addAll(STATIC_ASSETS)),
    )
    self.skipWaiting()
})

self.addEventListener("activate", event => {
    event.waitUntil(
        caches
            .keys()
            .then(keys =>
                Promise.all(
                    keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)),
                ),
            ),
    )
    self.clients.claim()
})

self.addEventListener("fetch", event => {
    if (event.request.method !== "GET") return

    const url = new URL(event.request.url)

    // Next.js static assets are content-hashed and immutable — cache-first forever
    if (url.pathname.startsWith("/_next/static/")) {
        event.respondWith(
            caches.match(event.request).then(
                cached =>
                    cached ||
                    fetch(event.request).then(response => {
                        const clone = response.clone()
                        caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone))
                        return response
                    }),
            ),
        )
        return
    }

    // Everything else (HTML, manifest, …) — stale-while-revalidate:
    // respond from cache immediately, update cache in the background
    event.respondWith(
        caches.open(CACHE_NAME).then(cache =>
            cache.match(event.request).then(cached => {
                const revalidate = fetch(event.request)
                    .then(response => {
                        if (response.ok) {
                            cache.put(event.request, response.clone())
                        }
                        return response
                    })
                    .catch(() => cached)

                return cached || revalidate
            }),
        ),
    )
})
