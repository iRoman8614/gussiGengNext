import { createContext, useContext, useState } from 'react';

const AssetsCacheContext = createContext();

export const useAssetsCache = () => useContext(AssetsCacheContext);

export const AssetsCacheProvider = ({ children }) => {
    const [cachedAssets, setCachedAssets] = useState({});
    const [isBackgroundLoading, setIsBackgroundLoading] = useState(false);
    const preloadAsset = (src) => {
        return new Promise((resolve) => {
            if (cachedAssets[src]) {
                resolve();
            } else {
                const img = new Image();
                img.src = src;
                img.onload = () => {
                    setCachedAssets((prev) => ({ ...prev, [src]: true }));
                    resolve();
                };
            }
        });
    };

    const preloadAssets = (assets) => Promise.all(assets.map(preloadAsset));
    const startBackgroundLoading = (assets) => {
        setIsBackgroundLoading(true);
        assets.reduce((chain, src) => {
            return chain.then(() => preloadAsset(src));
        }, Promise.resolve()).finally(() => setIsBackgroundLoading(false));
    };

    return (
        <AssetsCacheContext.Provider
            value={{ cachedAssets, preloadAssets, startBackgroundLoading, isBackgroundLoading }}
        >
            {children}
        </AssetsCacheContext.Provider>
    );
};
