const CACHE_VERSION = 'v3';

// self.addEventListener('fetch', (event) => {
//     event.respondWith(self.caches.match(event.request));
// })

/* Cache first, Update second (Stale-while-revalidate) */

const fromNetwork = async (evt) => {
    console.log("fromNetwork: ", evt);
    const response = await fetch(evt.request);
    if (response) {
        const cache = await self.caches.open(CACHE_VERSION);
        console.log("Got response: " + evt.request);
        cache.put(evt.request, response.clone());
    }
    return response;
};

// Sich häufig ändernder, aber unkritischer Inhalt wie z.B. Avatare
const respondTo = async (evt) => {
    console.log("respondTo: ", evt);
    const fromCache = await self.caches.match(evt.request);
    if (fromCache) {
        console.log("fromCache: ", fromCache);
        return fromCache; // Antwort aus Cache
    } else {
        console.log("from network");
        return fromNetwork(evt); // Antwort aus Cache
    }
};

self.addEventListener("fetch", (evt) => {
    console.log("FETCH EVENT OCCURRED: ", evt);
    // console.log("FETCH EVENT OCCURRED2: " + {evt});
    evt.respondWith(respondTo(evt));
});