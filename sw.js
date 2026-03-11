const CACHE_NAME = "blueplayer-cache-v1";

const FILES = [
  "./",
  "./index.html",

  "./icon-192.png",
  "./icon-512.png",

  "./manifest.json",

  "./src/css/style.css",

  "./src/js/player.js",
  "./src/js/playlist.js",
  "./src/js/ui.js",
  "./src/js/visualizer.js",
];

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches
      .open(CACHE_NAME)

      .then((cache) => cache.addAll(FILES)),
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches
      .match(e.request)

      .then((response) => response || fetch(e.request)),
  );
});
