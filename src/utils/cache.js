import { useEffect, useState } from 'react';

export function useCachedAssets(assetPaths, cacheName) {
    const [cachedAssets, setCachedAssets] = useState(assetPaths);

    useEffect(() => {
        const loadFromCache = async () => {
            const cache = await caches.open(cacheName);
            const newCachedAssets = { ...assetPaths };

            for (const [key, path] of Object.entries(assetPaths)) {
                const cachedResponse = await cache.match(path);
                if (cachedResponse) {
                    const blob = await cachedResponse.blob();
                    newCachedAssets[key] = URL.createObjectURL(blob);
                }
            }

            setCachedAssets(newCachedAssets);
        };

        loadFromCache();
    }, [assetPaths, cacheName]);

    return cachedAssets;
}