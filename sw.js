// Keeps the app working offline. Bump VERSION after changing files.
const VERSION = "lgn-v6";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./icon-180.png", "./icon-192.png", "./icon-512.png",
  "./cards/doppel.jpg", "./cards/loups-1.jpg", "./cards/loups-2.jpg", "./cards/sbire.jpg", "./cards/macons-1.jpg", "./cards/macons-2.jpg", "./cards/voyante.jpg", "./cards/voleur.jpg", "./cards/noiseuse.jpg", "./cards/soulard.jpg", "./cards/insomniaque.jpg", "./cards/villageois-1.jpg", "./cards/villageois-2.jpg", "./cards/villageois-3.jpg", "./cards/chasseur.jpg", "./cards/tanneur.jpg"];

self.addEventListener("install", e => {
  e.waitUntil(caches.open(VERSION).then(c => c.addAll(FILES)).then(() => self.skipWaiting()));
});
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== VERSION).map(k => caches.delete(k))))
    .then(() => self.clients.claim()));
});
// Network first (so updates arrive), cache as fallback when offline.
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(
    fetch(e.request).then(r => {
      const copy = r.clone();
      caches.open(VERSION).then(c => c.put(e.request, copy));
      return r;
    }).catch(() => caches.match(e.request).then(r => r || caches.match("./index.html")))
  );
});
