import React, { useEffect, useState } from 'react';
import type { AppProps } from 'next/app';
import { DefaultSeo } from 'next-seo';

import 'tailwindcss/tailwind.css';
import '../styles/globals.css';

import AppHeader from 'src/components/AppHeader/AppHeader';
import SexyChameleonText from 'src/components/SexyChameleonText/SexyChameleonText';
import Footer from 'src/components/Footer/Footer';

import ModalTerminal from 'src/content/ModalTerminal';
import IntegratedTerminal from 'src/content/IntegratedTerminal';
import { IInit } from 'src/types';
import WidgetTerminal from 'src/content/WidgetTerminal';
import { IFormConfigurator, INITIAL_FORM_CONFIG, JUPITER_DEFAULT_RPC } from 'src/constants';
import classNames from 'classnames';
import FormConfigurator from 'src/components/FormConfigurator';
import { Wallet } from '@solana/wallet-adapter-react';
import { UnsafeBurnerWalletAdapter } from '@solana/wallet-adapter-wallets';
import { WalletReadyState } from '@solana/wallet-adapter-base';
import { useForm } from 'react-hook-form';
import CodeBlocks from 'src/components/CodeBlocks/CodeBlocks';

const isDeveloping = process.env.NODE_ENV === 'development' && typeof window !== 'undefined';
// In NextJS preview env settings
const isPreview = Boolean(process.env.NEXT_PUBLIC_IS_NEXT_PREVIEW);
if ((isDeveloping || isPreview) && typeof window !== 'undefined') {
  // Initialize an empty value, simulate webpack IIFE when imported
  (window as any).Jupiter = {};

  // Perform local fetch on development, and next preview
  Promise.all([import('../library'), import('../index')]).then((res) => {
    const [libraryProps, rendererProps] = res;

    (window as any).Jupiter = libraryProps;
    (window as any).JupiterRenderer = rendererProps;
  });
}

export default function App({ Component, pageProps }: AppProps) {
  const [tab, setTab] = useState<IInit['displayMode']>('integrated');

  // Cleanup on tab change
  useEffect(() => {
    if (window.Jupiter._instance) {
      window.Jupiter._instance = null;
    }
  }, [tab]);

  const rpcUrl = JUPITER_DEFAULT_RPC;

  const { watch, reset, setValue, formState } = useForm<IFormConfigurator>({
    defaultValues: INITIAL_FORM_CONFIG,
  });

  const watchAllFields = watch();

  const [wallet, setWallet] = useState<Wallet | null>(null);

  useEffect(() => {
    if (!watchAllFields.useWalletPassthrough) {
      setWallet(null);
      return;
    }

    const fakeWallet: Wallet = {
      adapter: new UnsafeBurnerWalletAdapter(),
      readyState: WalletReadyState.Installed,
    };

    fakeWallet.adapter.connect().then(() => {
      setWallet(fakeWallet);
    });
  }, [watchAllFields.useWalletPassthrough]);

  return (
    <>
      <DefaultSeo
        title={'Marinade Widget'}
        openGraph={{
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
        }}
        twitter={{
          cardType: 'summary_large_image',
          site: 'jup.ag',
          handle: '@JupiterExchange',
        }}
      />

      <div className="bg-jupiter-dark-bg h-screen w-screen max-w-screen overflow-x-hidden flex flex-col justify-between">
        <div>
          <AppHeader />

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
                  <FormConfigurator {...watchAllFields} reset={reset} setValue={setValue} formState={formState} />
                </div>

                <div className="mt-8 md:mt-0 md:ml-4 h-full w-full bg-[#f7fafc] rounded-xl flex flex-col">
                  <div className="mt-4 flex justify-center ">
                    <button
                      onClick={() => {
                        setTab('modal');
                      }}
                      type="button"
                      className={classNames(
                        '!bg-none relative px-4 justify-center',
                        tab === 'modal' ? '' : 'opacity-20 hover:opacity-70',
                      )}
                    >
                      <div className="flex items-center text-md text-[#4A5568]">Modal</div>

                      {tab === 'modal' ? (
                        <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-[#308D8A]" />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTab('integrated');
                      }}
                      type="button"
                      className={classNames(
                        '!bg-none relative px-4 justify-center',
                        tab === 'integrated' ? '' : 'opacity-20 hover:opacity-70',
                      )}
                    >
                      <div className="flex items-center text-md text-[#4A5568]">Integrated</div>
                      {tab === 'integrated' ? (
                        <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-[#308D8A]" />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>

                    <button
                      onClick={() => {
                        setTab('widget');
                      }}
                      type="button"
                      className={classNames(
                        '!bg-none relative px-4 justify-center',
                        tab === 'widget' ? '' : 'opacity-20 hover:opacity-70',
                      )}
                    >
                      <div className="flex items-center text-md text-[#4A5568]">Widget</div>
                      {tab === 'widget' ? (
                        <div className="absolute left-0 bottom-[-8px] w-full h-0.5 bg-red" />
                      ) : (
                        <div className="absolute left-0 bottom-[-8px] w-full h-[1px] bg-white/50" />
                      )}
                    </button>
                  </div>

                  <span className="flex justify-center text-center text-xs text-[#9D9DA6] mt-4">
                    {tab === 'modal' ? 'Marinade renders as a modal and takes up the whole screen.' : null}
                    {tab === 'integrated' ? 'Marinade renders as a part of your dApp.' : null}
                    {tab === 'widget'
                      ? 'Marinade renders as part of a widget that can be placed at different positions on your dApp.'
                      : null}
                  </span>

                  <div className="flex flex-grow items-center justify-center text-[#4A5568]/75">
                    {tab === 'modal' ? (
                      <ModalTerminal
                        rpcUrl={rpcUrl}
                        formProps={watchAllFields.formProps}
                        palette={watchAllFields.palette}
                        fakeWallet={wallet}
                        defaultExplorer={watchAllFields.defaultExplorer}
                      />
                    ) : null}
                    {tab === 'integrated' ? (
                      <IntegratedTerminal
                        rpcUrl={rpcUrl}
                        formProps={watchAllFields.formProps}
                        palette={watchAllFields.palette}
                        fakeWallet={wallet}
                        defaultExplorer={watchAllFields.defaultExplorer}
                      />
                    ) : null}
                    {tab === 'widget' ? (
                      <WidgetTerminal
                        rpcUrl={rpcUrl}
                        formProps={watchAllFields.formProps}
                        palette={watchAllFields.palette}
                        fakeWallet={wallet}
                        defaultExplorer={watchAllFields.defaultExplorer}
                      />
                    ) : null}
                  </div>
                </div>

              </div>
            </div>
              {/* Mobile configurator */}
              <div className='flex md:hidden'>
                <FormConfigurator {...watchAllFields} reset={reset} setValue={setValue} formState={formState} />
              </div>
          </div>
        </div>

        <CodeBlocks formConfigurator={watchAllFields} displayMode={tab} />

        <div className="w-full bg-jupiter-bg mt-12">
          <Footer />
        </div>
      </div>
    </>
  );
}
