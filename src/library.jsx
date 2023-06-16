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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
var _a;
Object.defineProperty(exports, "__esModule", { value: true });
exports.close = exports.resume = exports.init = void 0;
const client_1 = require("react-dom/client");
require("tailwindcss/tailwind.css");
const react_1 = require("react");
const JupiterLogo_1 = __importDefault(require("./icons/JupiterLogo"));
const containerId = 'jupiter-terminal';
const packageJson = require('../package.json');
const bundleName = `main-${packageJson.version}`;
const scriptDomain = (() => {
    var _a;
    if (typeof window === 'undefined')
        return '';
    const url = (_a = document.currentScript) === null || _a === void 0 ? void 0 : _a.src;
    if (url) {
        return new URL(url).origin;
    }
    return '';
})() || 'https://terminal.jup.ag';
function loadRemote(id, href, type) {
    return __awaiter(this, void 0, void 0, function* () {
        return new Promise((res, rej) => {
            const existing = document.getElementById(id);
            if (existing) {
                res({});
            }
            else {
                let el = type === 'text/javascript'
                    ? document.createElement('script')
                    : document.createElement('link');
                el.id = id;
                el.onload = res;
                el.onerror = rej;
                if (el instanceof HTMLScriptElement) {
                    el.type = 'text/javascript';
                    el.src = href;
                }
                else if (el instanceof HTMLLinkElement) {
                    el.rel = 'stylesheet';
                    el.href = href;
                }
                document.head.append(el);
            }
        });
    });
}
function loadJupiter() {
    return __awaiter(this, void 0, void 0, function* () {
        if (process.env.NODE_ENV === 'development') {
            return;
        }
        try {
            // Load all the scripts and styles
            yield Promise.all([
                loadRemote('jupiter-load-script-app', `${scriptDomain}/${bundleName}-app.js`, 'text/javascript'),
                loadRemote('jupiter-load-styles-tailwind', `${scriptDomain}/${bundleName}-Tailwind.css`, 'stylesheet'),
                loadRemote('jupiter-load-styles-preflight', `${scriptDomain}/scoped-preflight.css`, 'stylesheet'),
            ]);
            // The sequence matters! the last imported Jupiter.css takes precendent
            loadRemote('jupiter-load-styles-jupiter', `${scriptDomain}/${bundleName}-Jupiter.css`, 'stylesheet');
        }
        catch (error) {
            console.error(`Error loading Jupiter Terminal: ${error}`);
            throw new Error(`Error loading Jupiter Terminal: ${error}`);
        }
    });
}
const defaultStyles = {
    zIndex: 50,
};
const RenderLoadableJupiter = (props) => {
    const [loaded, setLoaded] = (0, react_1.useState)(false);
    (0, react_1.useEffect)(() => {
        loadJupiter();
        let intervalId;
        if (!loaded) {
            intervalId = setInterval(() => {
                var _a;
                const instance = (_a = window.JupiterRenderer) === null || _a === void 0 ? void 0 : _a.RenderJupiter;
                if (instance) {
                    setLoaded(true);
                }
            }, 50);
        }
        return () => {
            clearInterval(intervalId);
        };
    }, [loaded]);
    const RenderJupiter = (0, react_1.useMemo)(() => {
        if (loaded) {
            return window.JupiterRenderer.RenderJupiter;
        }
        return EmptyJSX;
    }, [loaded]);
    return <RenderJupiter {...props} scriptDomain={scriptDomain}/>;
};
const EmptyJSX = () => <></>;
const RenderShell = (props) => {
    const displayMode = props.displayMode;
    const containerStyles = props.containerStyles;
    const containerClassName = props.containerClassName;
    const displayClassName = (0, react_1.useMemo)(() => {
        // Default Modal
        if (!displayMode || displayMode === 'modal') {
            return 'fixed top-0 w-screen h-screen flex items-center justify-center bg-black/50';
        }
        else if (displayMode === 'integrated' || displayMode === 'widget') {
            return 'flex items-center justify-center w-full h-full';
        }
    }, [displayMode]);
    const contentClassName = (0, react_1.useMemo)(() => {
        // Default Modal
        if (!displayMode || displayMode === 'modal') {
            return `flex flex-col h-screen w-screen max-h-[90vh] md:max-h-[600px] max-w-[360px] overflow-auto text-black relative bg-jupiter-bg rounded-lg webkit-scrollbar ${containerClassName || ''} p-4 h-fit`;
        }
        else if (displayMode === 'integrated' || displayMode === 'widget') {
            return 'flex flex-col h-full w-full overflow-auto text-black relative webkit-scrollbar p-4';
        }
    }, [displayMode]);
    const onClose = () => {
        if (window.Jupiter) {
            window.Jupiter.close();
        }
    };
    return (<div className={displayClassName}>
      {/* eslint-disable @next/next/no-page-custom-font */}
      <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&family=Poppins&display=swap" rel="stylesheet"></link>

      <div style={Object.assign(Object.assign({}, defaultStyles), containerStyles)} className={contentClassName}>
        <RenderLoadableJupiter {...props}/>
      </div>

      {!displayMode || displayMode === 'modal' ? (<div onClick={onClose} className="absolute w-screen h-screen top-0 left-0"/>) : null}
    </div>);
};
const RenderWidgetShell = (props) => {
    var _a, _b;
    const [isOpen, setIsOpen] = (0, react_1.useState)(false);
    const classes = (0, react_1.useMemo)(() => {
        var _a, _b, _c, _d, _e, _f;
        const size = ((_a = props.widgetStyle) === null || _a === void 0 ? void 0 : _a.size) || 'default';
        let result = undefined;
        if (!((_b = props.widgetStyle) === null || _b === void 0 ? void 0 : _b.position) || ((_c = props.widgetStyle) === null || _c === void 0 ? void 0 : _c.position) === 'bottom-right') {
            result = {
                containerClassName: 'bottom-6 right-6',
                contentClassName: size === 'default' ? 'bottom-[60px] -right-3' : 'bottom-[44px] -right-4',
            };
        }
        if (((_d = props.widgetStyle) === null || _d === void 0 ? void 0 : _d.position) === 'bottom-left') {
            result = {
                containerClassName: 'bottom-6 left-6',
                contentClassName: size === 'default' ? 'bottom-[60px] -left-3' : 'bottom-[44px] -left-4',
            };
        }
        if (((_e = props.widgetStyle) === null || _e === void 0 ? void 0 : _e.position) === 'top-left') {
            result = {
                containerClassName: 'top-6 left-6',
                contentClassName: size === 'default' ? 'top-[60px] -left-3' : 'top-[44px] -left-4',
            };
        }
        if (((_f = props.widgetStyle) === null || _f === void 0 ? void 0 : _f.position) === 'top-right') {
            result = {
                containerClassName: 'top-6 right-6',
                contentClassName: size === 'default' ? 'top-[60px] -right-3' : 'top-[44px] -right-4',
            };
        }
        return Object.assign(Object.assign({}, result), { widgetContainerClassName: size === 'default' ? 'h-14 w-14' : 'h-10 w-10', widgetLogoSize: size === 'default' ? 42 : 32 });
    }, [(_a = props.widgetStyle) === null || _a === void 0 ? void 0 : _a.position, (_b = props.widgetStyle) === null || _b === void 0 ? void 0 : _b.size]);
    return (<div className={`fixed ${classes.containerClassName}`}>
      <div className={`${classes.widgetContainerClassName} rounded-full bg-black flex items-center justify-center cursor-pointer`} onClick={() => setIsOpen(!isOpen)}>
        <JupiterLogo_1.default width={classes.widgetLogoSize} height={classes.widgetLogoSize}/>
      </div>

      <div id="integrated-terminal" className={`p-4 absolute overflow-hidden ${classes.contentClassName} flex flex-col w-[90vw] max-w-[384px] max-h-[75vh] rounded-2xl bg-jupiter-bg transition-opacity duration-300 shadow-2xl ${!isOpen ? 'h-0 opacity-0' : 'opacity-100'}`}>
        <RenderLoadableJupiter {...props}/>
      </div>
    </div>);
};
function init(props) {
    return __awaiter(this, void 0, void 0, function* () {
        const { passThroughWallet, onSwapError, onSuccess, integratedTargetId } = props, restProps = __rest(props, ["passThroughWallet", "onSwapError", "onSuccess", "integratedTargetId"]);
        const targetDiv = document.createElement('div');
        const instanceExist = document.getElementById(containerId);
        // Remove previous instance
        if (instanceExist) {
            window.Jupiter._instance = null;
            instanceExist === null || instanceExist === void 0 ? void 0 : instanceExist.remove();
        }
        targetDiv.id = containerId;
        targetDiv.classList.add('w-full');
        targetDiv.classList.add('h-full');
        if (restProps.displayMode === 'integrated') {
            const target = document.getElementById(integratedTargetId);
            if (!target) {
                throw new Error(`Jupiter Terminal: document.getElementById cannot find ${integratedTargetId}`);
            }
            target === null || target === void 0 ? void 0 : target.appendChild(targetDiv);
        }
        else {
            document.body.appendChild(targetDiv);
        }
        let element;
        if (restProps.displayMode === 'widget') {
            element = <RenderWidgetShell {...props}/>;
        }
        else {
            element = <RenderShell {...props}/>;
        }
        const root = (0, client_1.createRoot)(targetDiv);
        root.render(element);
        window.Jupiter.root = root;
        window.Jupiter._instance = element;
        // Passthrough & Callbacks
        window.Jupiter.passThroughWallet = passThroughWallet;
        window.Jupiter.onSwapError = onSwapError;
        window.Jupiter.onSuccess = onSuccess;
    });
}
exports.init = init;
const attributes = (_a = document.currentScript) === null || _a === void 0 ? void 0 : _a.attributes;
if (typeof window !== 'undefined') {
    document.onreadystatechange = function () {
        const loadComplete = document.readyState === 'complete';
        const shouldPreload = Boolean(attributes.getNamedItem('data-preload'));
        if (loadComplete && shouldPreload) {
            setTimeout(() => {
                loadJupiter()
                    .catch((error) => {
                    console.error(`Error pre-loading Jupiter Terminal: ${error}`);
                    throw new Error(`Error pre-loading Jupiter Terminal: ${error}`);
                });
            }, 2000);
        }
    };
}
const resume = () => {
    const instanceExist = document.getElementById(containerId);
    if (instanceExist) {
        instanceExist.style.display = 'block';
        return;
    }
};
exports.resume = resume;
const close = () => {
    const targetDiv = document.getElementById(containerId);
    if (targetDiv) {
        targetDiv.style.display = 'none';
    }
};
exports.close = close;
