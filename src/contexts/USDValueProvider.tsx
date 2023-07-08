import { useQuery } from '@tanstack/react-query';
import { createContext, FC, ReactNode, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { useLocalStorage } from 'react-use';
import { splitIntoChunks } from 'src/misc/utils';
import { PRICE_MINTS } from 'src/misc/constants';

const MAXIMUM_PARAM_SUPPORT = 100;
const CACHE_EXPIRE_TIME = 1000 * 60 * 1; // 1 min
const STORAGE_KEY = 'marinade-terminal-cached-token-prices';

interface CacheUSDValue {
  usd: number;
  timestamp: number;
}

export interface ITokenUSDValue {
  [key: string]: CacheUSDValue | undefined;
}

export interface USDValueState {
  tokenPriceMap: ITokenUSDValue;
}

export const USDValueProviderContext = createContext<USDValueState>({} as USDValueState);

export function useUSDValueProvider(): USDValueState {
  return useContext(USDValueProviderContext);
}

interface JupPriceResponse {
  [id: string]: { id: string; mintSymbol: string; vsToken: string; vsTokenSymbol: string; price: number };
}

const hasExpired = (timestamp: number) => {
  if (new Date().getTime() - timestamp >= CACHE_EXPIRE_TIME) {
    return true;
  }

  return false;
};

export const USDValueProvider: FC<{ children: ReactNode }> = ({ children }) => {
  const [cachedPrices, setCachedPrices] = useLocalStorage<ITokenUSDValue>(STORAGE_KEY, {});

  const getPriceFromJupAPI = useCallback(async (addresses: string[]) => {
    const { data }: { data: JupPriceResponse } = await fetch(
      `https://price.jup.ag/v4/price?ids=${addresses.join(',')}`,
    ).then((res) => res.json());

    const nowTimestamp = new Date().getTime();
    const result = addresses.reduce<{ result: Record<string, CacheUSDValue>; failed: string[] }>(
      (accValue, address, idx) => {
        const priceForAddress = data[address];
        if (!priceForAddress) {
          return {
            ...accValue,
            failed: [...accValue.failed, addresses[idx]],
          };
        }

        return {
          ...accValue,
          result: {
            ...accValue.result,
            [priceForAddress.id]: {
              usd: priceForAddress.price,
              timestamp: nowTimestamp,
            },
          },
        };
      },
      { result: {}, failed: [] },
    );

    return result;
  }, []);

  const { data: tokenPriceMap } = useQuery<ITokenUSDValue>(
    [PRICE_MINTS, Object.keys(cachedPrices || {}).length],
    async () => {
      let results: ITokenUSDValue = {};
      const tokenAddressToFetch: string[] = [];

      PRICE_MINTS.forEach((address) => {
        // could be empty string
        if (address) {
          const cachePrice = (cachedPrices || {})[address];

          if (!cachePrice) {
            tokenAddressToFetch.push(address);
            return;
          }

          if (hasExpired(cachePrice.timestamp)) {
            tokenAddressToFetch.push(address);
            return;
          }

          results = {
            ...results,
            [address]: {
              usd: cachePrice.usd,
              timestamp: cachePrice.timestamp,
            },
          };
        }
      });

      if (!tokenAddressToFetch.length) return results;

      try {
        // Fetch from JUP
        const fetchFromJup = splitIntoChunks(tokenAddressToFetch, MAXIMUM_PARAM_SUPPORT);

        const allResults = await Promise.all(
          fetchFromJup.map(async (batch) => {
            return await getPriceFromJupAPI(batch);
          }),
        );
        allResults.forEach(({ result }) => {
          results = {
            ...results,
            ...result,
          };
        });
      } catch (error) {
        console.error('Error fetching prices from Marinade Pricing API', error);
      }
      return results;
    },
    {
      staleTime: CACHE_EXPIRE_TIME,
      refetchInterval: CACHE_EXPIRE_TIME,
    },
  );

  // Clear the expired cache on first load
  useEffect(() => {
    setCachedPrices((prevState) =>
      Object.entries(prevState || {})
        .filter(([_mint, usdCacheValue]) => !hasExpired(usdCacheValue?.timestamp ?? 0))
        .reduce(
          (accValue, [mint, usdCacheValue]) => ({
            ...accValue,
            [mint]: usdCacheValue,
          }),
          {},
        ),
    );
  }, []);

  // use memo so that it avoid a rerendering
  const priceMap = useMemo(() => {
    return {
      ...cachedPrices,
      ...tokenPriceMap,
    };
  }, [tokenPriceMap, cachedPrices]);

  return (
    <USDValueProviderContext.Provider value={{ tokenPriceMap: priceMap }}>{children}</USDValueProviderContext.Provider>
  );
};
