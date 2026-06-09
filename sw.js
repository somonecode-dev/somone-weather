const CACHE_NAME = "somone-weather-v1";
const ASSETS = [
    "index.html",
    "style.css",
    "app.js",
    "manifest.json",
    "icon.png"
];

// 1. Installation du Service Worker et mise en cache des fichiers essentiels
self.addEventListener("install", (e) => {
    e.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log("[Service Worker] Mise en cache des fichiers applicatifs");
            return cache.addAll(ASSETS);
        })
    );
});

// 2. Activation et nettoyage des anciens caches si nécessaire
self.addEventListener("activate", (e) => {
    e.waitUntil(
        caches.keys().then((keys) => {
            return Promise.all(
                keys.map((key) => {
                    if (key !== CACHE_NAME) {
                        console.log("[Service Worker] Nettoyage de l'ancien cache :", key);
                        return caches.delete(key);
                    }
                })
            );
        })
    );
});

// 3. Interception des requêtes pour servir les fichiers depuis le cache (Mode Hors-ligne)
self.addEventListener("fetch", (e) => {
    e.respondWith(
        caches.match(e.request).then((cachedResponse) => {
            // Si le fichier est dans le cache, on le retourne, sinon on va le chercher sur le réseau
            return cachedResponse || fetch(e.request);
        })
    );
});