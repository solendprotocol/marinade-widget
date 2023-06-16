"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.USDValueProvider = exports.useUSDValueProvider = exports.USDValueProviderContext = void 0;
const react_query_1 = require("@tanstack/react-query");
const react_1 = require("react");
const react_use_1 = require("react-use");
const utils_1 = require("src/misc/utils");
const constants_1 = require("src/misc/constants");
const MAXIMUM_PARAM_SUPPORT = 100;
const CACHE_EXPIRE_TIME = 1000 * 60 * 1; // 1 min
const STORAGE_KEY = 'jupiter-terminal-cached-token-prices';
exports.USDValueProviderContext = (0, react_1.createContext)({});
function useUSDValueProvider() {
    return (0, react_1.useContext)(exports.USDValueProviderContext);
}
exports.useUSDValueProvider = useUSDValueProvider;
const hasExpired = (timestamp) => {
    if (new Date().getTime() - timestamp >= CACHE_EXPIRE_TIME) {
        return true;
    }
    return false;
};
const USDValueProvider = ({ children }) => {
    const [cachedPrices, setCachedPrices] = (0, react_use_1.useLocalStorage)(STORAGE_KEY, {});
    const getPriceFromJupAPI = (0, react_1.useCallback)((addresses) => __awaiter(void 0, void 0, void 0, function* () {
        const { data } = yield fetch(`https://price.jup.ag/v4/price?ids=${addresses.join(',')}`).then((res) => res.json());
        const nowTimestamp = new Date().getTime();
        const result = addresses.reduce((accValue, address, idx) => {
            const priceForAddress = data[address];
            if (!priceForAddress) {
                return Object.assign(Object.assign({}, accValue), { failed: [...accValue.failed, addresses[idx]] });
            }
            return Object.assign(Object.assign({}, accValue), { result: Object.assign(Object.assign({}, accValue.result), { [priceForAddress.id]: {
                        usd: priceForAddress.price,
                        timestamp: nowTimestamp,
                    } }) });
        }, { result: {}, failed: [] });
        return result;
    }), []);
    const { data: tokenPriceMap, isFetched: isLatest } = (0, react_query_1.useQuery)([constants_1.PRICE_MINTS, Object.keys(cachedPrices || {}).length], () => __awaiter(void 0, void 0, void 0, function* () {
        let results = {};
        const tokenAddressToFetch = [];
        constants_1.PRICE_MINTS.forEach((address) => {
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
                results = Object.assign(Object.assign({}, results), { [address]: {
                        usd: cachePrice.usd,
                        timestamp: cachePrice.timestamp,
                    } });
            }
        });
        if (!tokenAddressToFetch.length)
            return results;
        try {
            // Fetch from JUP
            const fetchFromJup = (0, utils_1.splitIntoChunks)(tokenAddressToFetch, MAXIMUM_PARAM_SUPPORT);
            const allResults = yield Promise.all(fetchFromJup.map((batch) => __awaiter(void 0, void 0, void 0, function* () {
                return yield getPriceFromJupAPI(batch);
            })));
            allResults.forEach(({ result }) => {
                results = Object.assign(Object.assign({}, results), result);
            });
        }
        catch (error) {
            console.log('Error fetching prices from Jupiter Pricing API', error);
        }
        return results;
    }), {
        staleTime: CACHE_EXPIRE_TIME,
        refetchInterval: CACHE_EXPIRE_TIME,
    });
    // Clear the expired cache on first load
    (0, react_1.useEffect)(() => {
        setCachedPrices((prevState) => Object.entries(prevState || {})
            .filter(([mint, usdCacheValue]) => { var _a; return !hasExpired((_a = usdCacheValue === null || usdCacheValue === void 0 ? void 0 : usdCacheValue.timestamp) !== null && _a !== void 0 ? _a : 0); })
            .reduce((accValue, [mint, usdCacheValue]) => (Object.assign(Object.assign({}, accValue), { [mint]: usdCacheValue })), {}));
    }, []);
    // use memo so that it avoid a rerendering
    const priceMap = (0, react_1.useMemo)(() => {
        return Object.assign(Object.assign({}, cachedPrices), tokenPriceMap);
    }, [tokenPriceMap, cachedPrices]);
    return <exports.USDValueProviderContext.Provider value={{ tokenPriceMap: priceMap }}>{children}</exports.USDValueProviderContext.Provider>;
};
exports.USDValueProvider = USDValueProvider;
