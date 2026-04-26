// No service worker for this app — unregister any stale one
self.addEventListener('install', () => self.skipWaiting())
self.addEventListener('activate', () => {
  self.registration.unregister()
    .then(() => self.clients.matchAll())
    .then(clients => clients.forEach(c => c.navigate(c.url)))
})
