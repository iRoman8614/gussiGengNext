const cacheMap = {};

const updateCacheMap = (assets, cacheName) => {
    assets.forEach((asset) => {
        cacheMap[asset] = cacheName;
    });
};

self.onmessage = async function (event) {
    const { type, assets, cacheName } = event.data;

    if (type === 'CLEAR_CACHE') {
        const cacheNames = await caches.keys();
        for (const cacheName of cacheNames) {
            await caches.delete(cacheName);
        }
        console.log('All caches cleared');
        Object.keys(cacheMap).forEach(key => delete cacheMap[key]);
        return;
    }

    if (!assets || !cacheName) {
        console.error("No assets or cacheName provided to worker");
        return;
    }
    updateCacheMap(assets, cacheName);

    const cache = await caches.open(cacheName);
    for (let asset of assets) {
        try {
            const cachedResponse = await cache.match(asset);
            if (cachedResponse) {
                console.log(`Asset ${asset} уже в кэше, пропускаем загрузку`);
                postMessage({ status: "cached", asset });
                continue;
            }
            const response = await fetch(asset);
            if (response.ok) {
                await cache.put(asset, response.clone());
                postMessage({ status: "loaded", asset });
            } else {
                throw new Error(`Failed to fetch ${asset}: ${response.status}`);
            }
        } catch (error) {
            postMessage({ status: "error", asset, error: error.message });
            await new Promise(res => setTimeout(res, 2000));
        }
    }
    postMessage({ status: "complete", cacheName });
};
self.addEventListener('fetch', (event) => {
    const cacheName = cacheMap[event.request.url];
    if (cacheName) {
        event.respondWith(
            caches.open(cacheName).then((cache) =>
                cache.match(event.request).then((cachedResponse) => {
                    return cachedResponse || fetch(event.request).then((response) => {
                        cache.put(event.request, response.clone());
                        return response;
                    });
                })
            )
        );
    } else {
        event.respondWith(fetch(event.request));
    }
});
