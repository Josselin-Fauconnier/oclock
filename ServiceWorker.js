const CACHE = "horloge-v1";
const ASSETS = [
  "/", "index.html", "minuteur.html", "chronometre.html", "horloge.html", "reveil.html",
  "style.css",
  "JS/script.js", "JS/chronometre.js", "JS/horloge.js", "JS/minuteur.js", "JS/reveil.js"
];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((cache) => cache.addAll(ASSETS)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((noms) =>
      Promise.all(noms.filter((nom) => nom !== CACHE).map((nom) => caches.delete(nom)))
    )
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    caches.match(e.request).then((res) => res || fetch(e.request))
  );
});
