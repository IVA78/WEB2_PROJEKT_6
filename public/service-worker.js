const CACHE_NAME = "book-tracker-cache-v1";
const URLS_TO_CACHE = ["/", "/index.html", "/styles.css", "manifest.json"];

self.addEventListener("install", (event) => {
  console.log("Installing service worker and caching static assets");
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      cache.addAll(URLS_TO_CACHE);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => response || fetch(event.request))
  );
});
