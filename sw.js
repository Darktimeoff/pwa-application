const staticCacheName = 's-app-v5';
const dynamicCacheName = 'd-app-v2';

const assetURL = [
    'offline.html',
    'index.html',
    '/js/app.js',
    '/css/styles.css',
]

self.addEventListener('install', async e => {
    console.log('[SW]: install', e);
    const cache = await caches.open(staticCacheName)
    await cache.addAll(assetURL)
});

self.addEventListener('uninstall', e => {s
    console.log('[SW]: uninstall', e);
});

self.addEventListener('activate', async e => {
    console.log('[SW]: activate');
    await updateAllCache([staticCacheName, dynamicCacheName]);
});

self.addEventListener('fetch', e => {
    // call in every time when we make request  to network, static file also 
    const {request} = e;
    console.log('[SW]: fetch', request.url);

    const url = new URL(request.url);

    if(isLoadStatic(url)) {
        // this means if url where app make request and own location same, we try to download some static files to our site
        // and we need to use strategy cache first
        e.respondWith(cacheFirst(request))
    } else {
        e.respondWith(networkFirst(request))
    }
});


async function cacheFirst(request) {
    const cached = await caches.match(request);
    console.log('[SW]: cached', cached)
    return cached ?? await fetch(request)
}

function isLoadStatic(requestURL='') {
    return requestURL.origin === location.origin
}


async function updateAllCache(names) {
    const cacheNames = await caches.keys();
    await Promise.all(
        cacheNames
            .filter(name => !names.includes(name))
            .map(name => caches.delete(name))

    )
}

async function networkFirst(request) {
    const cache = await caches.open(dynamicCacheName)
    try {
        const response = await fetch(request)
        await cache.put(request, response.clone())
        return response;
    } catch(err) {
       const cached = await cache.match(request);
       return cached ?? await caches.match('/offline.html')
    }
}