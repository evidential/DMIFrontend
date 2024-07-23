importScripts('assets/workbox/workbox-4.3.1-sw.js');

// the precache manifest will be injected into the following line
const preCacheManifest = [];

self.addEventListener("message", ({ data }) => {
  if (data === "skipWaiting") {
    self.skipWaiting();
  }
});

// Strategy to fetch resources from Cache first, falling back to network
self.addEventListener('fetch', async (e) => {
  const {request} = e;
  try {
    const cache = await caches.match(request);

    if (cache) {
      // Return a cached response if we have one
      const cachedResponse = await cache.match(request.url);

      if (cachedResponse) {
        e.respondWith(cachedResponse);
        return;
      }
    }

    // Otherwise, hit the network
    const fetchedResponse = await fetch(request);

    // Add the network response to the cache for later visits
    if (cache) {
      await cache.put(request, fetchedResponse.clone());
    }

    // Return the network response
    e.respondWith(fetchedResponse);
  } catch (error) {
    // Handle errors here, e.g., respond with a fallback response
    //console.error('An error occurred', error);
  }
});

self.workbox.precaching.precacheAndRoute(preCacheManifest);



