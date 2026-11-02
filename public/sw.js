// Kill-switch: removes the old offline worker so visitors always get the latest version.
self.addEventListener("install", () => self.skipWaiting());
self.addEventListener("activate", (event) =>
  event.waitUntil(
    (async () => {
      try {
        const names = await caches.keys();
        await Promise.allSettled(
          names
            .filter((n) => /(^|-)precache-v\d+-|(^|-)runtime-|workbox/.test(n))
            .map((n) => caches.delete(n)),
        );
        await self.clients.claim();
        const clients = await self.clients.matchAll({ type: "window" });
        await Promise.allSettled(clients.map((c) => c.navigate(c.url)));
      } finally {
        await self.registration.unregister();
      }
    })(),
  ),
);
