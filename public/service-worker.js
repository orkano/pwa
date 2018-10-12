const CACHE_VERSION = 'v3';

// self.addEventListener('fetch', (event) => {
//     event.respondWith(self.caches.match(event.request));
// })

/* Cache first, Update second (Stale-while-revalidate) */

const fromNetwork = async (evt) => {
    const response = await fetch(evt.request);
    if (response) {
        const cache = await self.caches.open(CACHE_VERSION);
        cache.put(evt.request, response.clone());
    }
    return response;
};

// Sich häufig ändernder, aber unkritischer Inhalt wie z.B. Avatare
const respondTo = async (evt) => {
    console.log("Current Request: " + JSON.stringify(evt.request));
    const fromCache = await self.caches.match(evt.request);
    if (fromCache) {
        if (navigator.connection.downlinkMax > 100) { // LTE oder besser
            fromNetwork(evt); // Cache-Aktualisierung triggern
        }
        return fromCache; // Antwort aus Cache
    } else {
        return fromNetwork(evt); // Antwort aus Cache
    }
};

self.addEventListener("fetch", (evt) => {
    console.log("FETCH EVENT OCCURRED: " + JSON.stringify(evt));
    evt.respondWith(respondTo(evt));
});