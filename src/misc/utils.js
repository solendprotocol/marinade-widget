"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.base64ToJson = exports.jsonToBase64 = exports.hasNumericValue = exports.splitIntoChunks = exports.useDebouncedEffect = exports.useOutsideClick = exports.detectedSeparator = exports.isMobile = exports.useReactiveEventListener = exports.toLamports = exports.fromLamports = exports.shortenAddress = exports.formatNumber = exports.numberFormatter = void 0;
const decimal_js_1 = __importDefault(require("decimal.js"));
const bn_js_1 = __importDefault(require("bn.js"));
const react_1 = require("react");
const userLocale = typeof window !== 'undefined'
    ? navigator.languages && navigator.languages.length
        ? navigator.languages[0]
        : navigator.language
    : 'en-US';
exports.numberFormatter = new Intl.NumberFormat(userLocale, {
    style: 'decimal',
    minimumFractionDigits: 0,
    maximumFractionDigits: 9,
});
exports.formatNumber = {
    format: (val, precision) => {
        if (!val && val !== 0) {
            return '--';
        }
        if (precision !== undefined) {
            return val.toFixed(precision);
        }
        else {
            return exports.numberFormatter.format(val);
        }
    },
};
function shortenAddress(address, chars = 4) {
    return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}
exports.shortenAddress = shortenAddress;
function fromLamports(lamportsAmount, decimals, rate = 1.0) {
    if (!lamportsAmount) {
        return 0;
    }
    const amount = bn_js_1.default.isBN(lamportsAmount) ? lamportsAmount : lamportsAmount;
    const base = 10;
    const precision = new decimal_js_1.default(base).pow(decimals !== null && decimals !== void 0 ? decimals : 6);
    return new decimal_js_1.default(amount.toString()).div(precision).mul(rate).toNumber();
}
exports.fromLamports = fromLamports;
function toLamports(lamportsAmount, decimals) {
    let amount = bn_js_1.default.isBN(lamportsAmount) ? lamportsAmount.toNumber() : Number(lamportsAmount);
    if (Number.isNaN(amount)) {
        amount = 0;
    }
    const precision = Math.pow(10, decimals);
    return Math.floor(amount * precision);
}
exports.toLamports = toLamports;
// https://usehooks.com/useEventListener/
function useReactiveEventListener(eventName, handler, element = typeof window !== 'undefined' ? window : null) {
    // Create a ref that stores handler
    const savedHandler = (0, react_1.useRef)();
    // Update ref.current value if handler changes.
    // This allows our effect below to always get latest handler ...
    // ... without us needing to pass it in effect deps array ...
    // ... and potentially cause effect to re-run every render.
    (0, react_1.useEffect)(() => {
        savedHandler.current = handler;
    }, [handler]);
    (0, react_1.useEffect)(() => {
        if (typeof window !== 'undefined') {
            // Make sure element supports addEventListener
            // On
            const isSupported = element && element.addEventListener;
            if (!isSupported)
                return;
            // Create event listener that calls handler function stored in ref
            const eventListener = (event) => typeof savedHandler.current === 'function' && savedHandler.current(event);
            // Add event listener
            element.addEventListener(eventName, eventListener);
            // Remove event listener on cleanup
            return () => {
                element.removeEventListener(eventName, eventListener);
            };
        }
    }, [eventName, element]);
}
exports.useReactiveEventListener = useReactiveEventListener;
const isMobile = () => typeof window !== 'undefined' && screen && screen.width <= 480;
exports.isMobile = isMobile;
exports.detectedSeparator = exports.formatNumber.format(1.1).substring(1, 2);
function useOutsideClick(ref, handler) {
    (0, react_1.useEffect)(() => {
        const listener = (event) => {
            // Do nothing if clicking ref's element or descendent elements
            if (!ref.current || ref.current.contains(event.target)) {
                return;
            }
            handler(event);
        };
        document.addEventListener('mouseup', listener);
        return () => {
            document.removeEventListener('mouseup', listener);
        };
    }, [ref, handler]);
}
exports.useOutsideClick = useOutsideClick;
function useDebouncedEffect(fn, deps, time) {
    const dependencies = [...deps, fn, time];
    (0, react_1.useEffect)(() => {
        const timeout = setTimeout(fn, time);
        return () => {
            clearTimeout(timeout);
        };
    }, dependencies);
}
exports.useDebouncedEffect = useDebouncedEffect;
function splitIntoChunks(array, size) {
    return Array.apply(0, new Array(Math.ceil(array.length / size))).map((_, index) => array.slice(index * size, (index + 1) * size));
}
exports.splitIntoChunks = splitIntoChunks;
const hasNumericValue = (amount) => {
    if (amount && !Number.isNaN(Number(amount))) {
        return true;
    }
    return false;
};
exports.hasNumericValue = hasNumericValue;
function jsonToBase64(object) {
    try {
        const json = JSON.stringify(object);
        return Buffer.from(json).toString("base64");
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
exports.jsonToBase64 = jsonToBase64;
function base64ToJson(base64String) {
    try {
        const json = Buffer.from(base64String, "base64").toString();
        return JSON.parse(json);
    }
    catch (error) {
        console.log(error);
        return null;
    }
}
exports.base64ToJson = base64ToJson;
