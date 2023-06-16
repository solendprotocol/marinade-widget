"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = __importStar(require("react"));
const next_seo_1 = require("next-seo");
require("tailwindcss/tailwind.css");
require("../styles/globals.css");
const AppHeader_1 = __importDefault(require("src/components/AppHeader/AppHeader"));
const Footer_1 = __importDefault(require("src/components/Footer/Footer"));
const ModalTerminal_1 = __importDefault(require("src/content/ModalTerminal"));
const IntegratedTerminal_1 = __importDefault(require("src/content/IntegratedTerminal"));
const WidgetTerminal_1 = __importDefault(require("src/content/WidgetTerminal"));
const constants_1 = require("src/constants");
const classnames_1 = __importDefault(require("classnames"));
const FormConfigurator_1 = __importDefault(require("src/components/FormConfigurator"));
const wallet_adapter_wallets_1 = require("@solana/wallet-adapter-wallets");
const wallet_adapter_base_1 = require("@solana/wallet-adapter-base");
const react_hook_form_1 = require("react-hook-form");
const CodeBlocks_1 = __importDefault(require("src/components/CodeBlocks/CodeBlocks"));
const isDeveloping = process.env.NODE_ENV === 'development' && typeof window !== 'undefined';
// In NextJS preview env settings
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
    // Initialize an empty value, simulate webpack IIFE when imported
    window.Jupiter = {};
    // Perform local fetch on development, and next preview
    Promise.all([Promise.resolve().then(() => __importStar(require('../library'))), Promise.resolve().then(() => __importStar(require('../index')))]).then((res) => {
        const [libraryProps, rendererProps] = res;
        window.Jupiter = libraryProps;
        window.JupiterRenderer = rendererProps;
    });
}
function App({ Component, pageProps }) {
    const [tab, setTab] = (0, react_1.useState)('integrated');
    // Cleanup on tab change
    (0, react_1.useEffect)(() => {
        if (window.Jupiter._instance) {
            window.Jupiter._instance = null;
        }
    }, [tab]);
    const rpcUrl = constants_1.JUPITER_DEFAULT_RPC;
    const { watch, reset, setValue, formState } = (0, react_hook_form_1.useForm)({
        defaultValues: constants_1.INITIAL_FORM_CONFIG,
    });
    const watchAllFields = watch();
    const [wallet, setWallet] = (0, react_1.useState)(null);
    (0, react_1.useEffect)(() => {
        if (!watchAllFields.useWalletPassthrough) {
            setWallet(null);
            return;
        }
        const fakeWallet = {
            adapter: new wallet_adapter_wallets_1.UnsafeBurnerWalletAdapter(),
            readyState: wallet_adapter_base_1.WalletReadyState.Installed,
        };
        fakeWallet.adapter.connect().then(() => {
            setWallet(fakeWallet);
        });
    }, [watchAllFields.useWalletPassthrough]);
    return (<>
      <next_seo_1.DefaultSeo title={'Marinade Widget'} openGraph={{
            type: 'website',
            locale: 'en',
            title: 'Marinade Widget',
            description: 'Marinade Widget: An open-sourced, lite version of Jupiter that provides end-to-end swap flow.',
            url: 'https://terminal.jup.ag/',
            site_name: 'Marinade Widget',
            images: [
                {
                    url: `https://og.jup.ag/api/jupiter`,
                    alt: 'Marinade Widget',
                }
            ],
        }} twitter={{
            cardType: 'summary_large_image',
            site: 'jup.ag',
            handle: '@JupiterExchange',
        }}/>

      <div className="bg-jupiter-dark-bg h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between">
        <div>
          <AppHeader_1.default />

          <div className="">
            <div className="flex flex-col items-center h-full w-full mt-4 md:mt-14">
              <div className="flex flex-col justify-center items-center text-center">
                <span className="text-4xl md:text-[52px] font-semibold px-4 pb-2 md:px-0 text-black">
                  Marinade Widget
                </span>
                <p className="text-[#9D9DA6] w-[80%] md:max-w-[60%] text-md mt-4 heading-[24px]">
                  An open-sourced, Marinade widget that provides end-to-end swap flow by linking it in your HTML.
                  Check out the visual demo for the various integration modes below.
                </p>
              </div>
            </div>

            <div className="flex justify-center">
              <div className="max-w-6xl bg-white mt-12 rounded-xl flex flex-col md:flex-row w-full md:p-4">
                {/* Desktop configurator */}
                <div className='hidden md:flex'>
                  <FormConfigurator_1.default {...watchAllFields} reset={reset} setValue={setValue} formState={formState}/>
                </div>

                <div className="mt-8 md:mt-0 md:ml-4 h-full w-full bg-[#f7fafc] rounded-xl flex flex-col">
                  <div className="mt-4 flex justify-center ">
                    <button onClick={() => {
            setTab('modal');
        }} type="button" className={(0, classnames_1.default)('!bg-none relative px-4 justify-center', tab === 'modal' ? '' : 'opacity-20 hover:opacity-70')}>
                      <div className="flex items-center text-md text-[#4A5568]">Modal</div>

                      {tab === 'modal' ? (<div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-[#308D8A]"/>) : (<div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50"/>)}
                    </button>

                    <button onClick={() => {
            setTab('integrated');
        }} type="button" className={(0, classnames_1.default)('!bg-none relative px-4 justify-center', tab === 'integrated' ? '' : 'opacity-20 hover:opacity-70')}>
                      <div className="flex items-center text-md text-[#4A5568]">Integrated</div>
                      {tab === 'integrated' ? (<div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-[#308D8A]"/>) : (<div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50"/>)}
                    </button>

                    <button onClick={() => {
            setTab('widget');
        }} type="button" className={(0, classnames_1.default)('!bg-none relative px-4 justify-center', tab === 'widget' ? '' : 'opacity-20 hover:opacity-70')}>
                      <div className="flex items-center text-md text-[#4A5568]">Widget</div>
                      {tab === 'widget' ? (<div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-red"/>) : (<div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50"/>)}
                    </button>
                  </div>

                  <span className="flex justify-center text-center text-xs text-[#9D9DA6] mt-4">
                    {tab === 'modal' ? 'Jupiter renders as a modal and takes up the whole screen.' : null}
                    {tab === 'integrated' ? 'Jupiter renders as a part of your dApp.' : null}
                    {tab === 'widget'
            ? 'Jupiter renders as part of a widget that can be placed at different positions on your dApp.'
            : null}
                  </span>

                  <div className="flex flex-grow items-center justify-center text-[#4A5568]/75">
                    {tab === 'modal' ? (<ModalTerminal_1.default rpcUrl={rpcUrl} formProps={watchAllFields.formProps} fakeWallet={wallet} strictTokenList={watchAllFields.strictTokenList} defaultExplorer={watchAllFields.defaultExplorer}/>) : null}
                    {tab === 'integrated' ? (<IntegratedTerminal_1.default rpcUrl={rpcUrl} formProps={watchAllFields.formProps} fakeWallet={wallet} strictTokenList={watchAllFields.strictTokenList} defaultExplorer={watchAllFields.defaultExplorer}/>) : null}
                    {tab === 'widget' ? (<WidgetTerminal_1.default rpcUrl={rpcUrl} formProps={watchAllFields.formProps} fakeWallet={wallet} strictTokenList={watchAllFields.strictTokenList} defaultExplorer={watchAllFields.defaultExplorer}/>) : null}
                  </div>
                </div>

              </div>
            </div>
              {/* Mobile configurator */}
              <div className='flex md:hidden'>
                <FormConfigurator_1.default {...watchAllFields} reset={reset} setValue={setValue} formState={formState}/>
              </div>
          </div>
        </div>

        <CodeBlocks_1.default formConfigurator={watchAllFields} displayMode={tab}/>

        <div className="w-full bg-jupiter-bg mt-12">
          <Footer_1.default />
        </div>
      </div>
    </>);
}
exports.default = App;
