// Einfacher Service Worker: App-Dateien werden zwischengespeichert,
// damit die App schnell startet und sich auf dem Homescreen installieren lässt.
// Kartenkacheln werden bewusst NICHT gecacht (OSM-Nutzungsrichtlinie).
const CACHE = "foodmap-v1";
const FILES = ["./", "index.html", "style.css", "app.js", "data.js", "vendor/leaflet.js", "vendor/leaflet.css",
  "vendor/images/marker-icon.png", "vendor/images/layers.png", "manifest.webmanifest", "icons/icon.svg", "icons/icon-192.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES)).then(() => self.skipWaiting())); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(k => Promise.all(k.filter(x => x !== CACHE).map(x => caches.delete(x)))).then(() => self.clients.claim()));
});
self.addEventListener("fetch", e => {
  const u = new URL(e.request.url);
  if (u.origin !== location.origin || e.request.method !== "GET") return; // Kacheln: normal aus dem Netz
  // Netz zuerst (damit Änderungen sofort ankommen), sonst Cache
  e.respondWith(fetch(e.request).then(r => {
    const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r;
  }).catch(() => caches.match(e.request)));
});
