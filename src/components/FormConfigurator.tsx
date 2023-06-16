import { SwapMode } from '@jup-ag/react-hook';
import classNames from 'classnames';
import React, { useEffect, useRef, useState } from 'react';
import { FormState, UseFormReset, UseFormSetValue } from 'react-hook-form';
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import Toggle from './Toggle';
import { AVAILABLE_EXPLORER } from '../contexts/preferredExplorer/index';
import { IFormConfigurator } from 'src/constants';
import { useRouter } from 'next/router';
import { base64ToJson } from 'src/misc/utils';
import { THEME } from 'src/types';

const FormConfigurator = ({
  useWalletPassthrough,
  defaultExplorer,
  formProps,
  theme,
  // Hook form
  reset,
  setValue,
  formState,
}: IFormConfigurator & {
  // Hook form
  theme: THEME;
  reset: UseFormReset<IFormConfigurator>;
  setValue: UseFormSetValue<IFormConfigurator>;
  formState: FormState<IFormConfigurator>;
}) => {
  const currentTemplate = useRef('');
  const { query, replace } = useRouter();

  const [isImported, setIsImported] = useState(false);

  useEffect(() => {
    const templateString = query?.import
    if (templateString) {
      const data = base64ToJson(templateString as string);

      if (!data) {
        replace({ query: undefined })
        return;
      }

      reset({
        ...formState.defaultValues,
        ...data,
      })
      setIsImported(true);
      return;
    }

    const templateName = query?.template
    if (currentTemplate.current === templateName) return
  }, [query])

  const [isOpen, setIsOpen] = React.useState(false);
  const [active, setActive] = React.useState(0);
  const [isExplorerDropdownOpen, setIsExplorerDropdownOpen] = React.useState(false);
  return (
    <div className="w-full max-w-full border border-white/10 md:border-none md:mx-0 md:max-w-[300px] max-h-[700px] overflow-y-scroll overflow-x-hidden webkit-scrollbar bg-white/5 rounded-xl p-4">
      <p className="text-[#4A5568] mt-8 text-sm font-semibold">Things you can configure</p>

      {/* Referral code */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Referral code (Optional)</p>
          <p className="text-xs text-[#4A5568]/30">Enter referral code to earn fees</p>
        </div>
      </div>
      <input
        className="mt-2 text-[#4A5568] w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
        value={formProps.referralCode}
        onChange={(e) => {
            setValue('formProps.referralCode', e.target.value);
        }}
      />

      {/* Initial mint */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Initial liquid stake token mint</p>
          <p className="text-xs text-[#4A5568]/30">Set a default token to stake</p>
        </div>
      </div>
      <input
        className="mt-2 text-[#4A5568] w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
        value={formProps.initialInputMint}
        onChange={(e) => {
          const regex = /^[0-9\b]+$/;
          const value = e.target.value;
          if (value === '' || regex.test(value)) {
            setValue('formProps.initialInputMint', value);
          }
        }}
      />

      {/* Initial validator */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Initial validator</p>
          <p className="text-xs text-[#4A5568]/30">Set a default validator to manually stake to. Otherwise, an automatic strategy is used</p>
        </div>
      </div>
      <input
        className="mt-2 text-[#4A5568] w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
        value={formProps.initialValidator}
        onChange={(e) => {
          const regex = /^[0-9\b]+$/;
          const value = e.target.value;
          if (value === '' || regex.test(value)) {
            setValue('formProps.initialValidator', value);
          }
        }}
      />

      {/* Initial amount */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Initial amount</p>
          <p className="text-xs text-[#4A5568]/30">Initial stake amount inputted</p>
        </div>
      </div>
      <input
        className="mt-2 text-[#4A5568] w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
        value={formProps.initialAmount}
        inputMode='numeric'
        onChange={(e) => {
          const regex = /^[0-9\b]+$/;
          const value = e.target.value;
          if (value === '' || regex.test(value)) {
            setValue('formProps.initialAmount', value);
          }
        }}
      />

      {/* Fixed input */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Fixed amount</p>
          <p className="text-xs text-[#4A5568]/30">Enable or disable user inputted amounts</p>
        </div>
        <Toggle
          className="min-w-[40px]"
          active={!!formProps.fixedAmount}
          onClick={() => setValue('formProps.fixedAmount', !formProps.fixedAmount, {shouldDirty: true})}
        />
      </div>

      {/* Theme */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Theme</p>
          <p className="text-xs text-[#4A5568]/30">Light mode</p>
        </div>
        <Toggle
          className="min-w-[40px]"
          active={theme === 'dark'}
          onClick={() => setValue('theme', theme === 'dark' ? 'light' : 'dark')}
        />
      </div>

      {/* Wallet passthrough */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Simulate wallet passthrough</p>
          <p className="text-xs text-[#4A5568]/30">Simulate Terminal with a fake wallet passthrough</p>
        </div>
        <Toggle
          className="min-w-[40px]"
          active={useWalletPassthrough}
          onClick={() => setValue('useWalletPassthrough', !useWalletPassthrough)}
        />
      </div>
      <div className="w-full border-b border-white/10 py-3" />

      {/* Preferred Explorer  */}
      <div className="relative inline-block text-left text-[#4A5568] w-full mt-5">
        <p className="text-[#4A5568] text-sm font-semibold">Preferred Explorer</p>

        <div className="mt-4">
          <button
            onClick={() => setIsExplorerDropdownOpen(!isExplorerDropdownOpen)}
            type="button"
            className="w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <div className='flex items-center justify-center space-x-2.5'>
              <p>{Object.values(AVAILABLE_EXPLORER).find(item => item.name === defaultExplorer)?.name}</p>
            </div>

            <ChevronDownIcon />
          </button>

          {isExplorerDropdownOpen ? (
            <div
              className="absolute left-0 bottom-6 z-10 ml-1 mt-1 origin-top-right rounded-md shadow-xl bg-zinc-700 w-full border border-white/20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {AVAILABLE_EXPLORER.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setValue('defaultExplorer', item.name)
                    setIsExplorerDropdownOpen(false);
                  }}
                  type="button"
                  className={classNames(
                    'flex items-center w-full px-4 py-2 text-sm hover:[#308D8A]/20 text-left',
                    active === index ? '' : '',
                    index !== AVAILABLE_EXPLORER.length - 1 ? 'border-b border-white/10' : '',
                  )}
                >
                  <span>{item.name}</span>
                </button>
              ))}
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};

export default FormConfigurator;
