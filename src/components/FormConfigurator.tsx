import React from 'react';
import classNames from 'classnames';
import { UseFormSetValue } from 'react-hook-form';
import ChevronDownIcon from 'src/icons/ChevronDownIcon';
import Toggle from './Toggle';
import { AVAILABLE_EXPLORER } from '../contexts/preferredExplorer/index';
import { IFormConfigurator } from 'src/constants';
import { AllowedStakeModeType, ThemeType } from 'src/types';
import ChevronUpIcon from 'src/icons/ChevronUpIcon';
import InputColor from 'react-input-color';

const ALLOWED_STAKE_MODES: Array<{
  value: AllowedStakeModeType;
  label: string;
}> = [
  {
    value: 'stake',
    label: 'Staking only',
  },
  {
    value: 'unstake',
    label: 'Unstaking only',
  },
  {
    value: 'both',
    label: 'Staking + Unstaking',
  },
];

const THEME_MODES: Array<{
  value: ThemeType;
  label: string;
}> = [
  {
    value: 'auto',
    label: 'Automatic',
  },
  {
    value: 'light',
    label: 'Force light mode',
  },
  {
    value: 'dark',
    label: 'Force dark mode',
  },
];

const FormConfigurator = ({
  useWalletPassthrough,
  defaultExplorer,
  formProps,
  palette,
  stakeMode,
  theme,
  // Hook form
  setValue,
}: IFormConfigurator & {
  // Hook form
  theme: ThemeType;
  setValue: UseFormSetValue<IFormConfigurator>;
}) => {
  const [isExplorerDropdownOpen, setIsExplorerDropdownOpen] = React.useState(false);
  const [isThemeDropdownOpen, setIsThemeDropdownOpen] = React.useState(false);
  const [isStakeModeDropdownOpen, setIsStakeModeDropdownOpen] = React.useState(false);
  const [isPaletteDropdownOpen, setIsPaletteDropdownOpen] = React.useState(false);

  return (
    <div className="w-full max-w-full border border-white/10 md:border-none md:mx-0 md:max-w-[450px] max-h-[700px] overflow-y-scroll overflow-x-visible webkit-scrollbar bg-white/5 rounded-xl p-4">
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

      {/* Theme */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Allow direct stake</p>
          <p className="text-xs text-[#4A5568]/30">
            Enable to allow user to selected a valiadator to stake directly to
          </p>
        </div>
        <Toggle
          className="min-w-[40px]"
          active={Boolean(formProps.allowDirectStake)}
          onClick={() => setValue('formProps.allowDirectStake', !formProps.allowDirectStake)}
        />
      </div>

      {/* Initial validator */}
      <div className="flex justify-between mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Initial validator</p>
          <p className="text-xs text-[#4A5568]/30">
            If direct staking is allowed, set a default validator. Otherwise, an automatic strategy is defaulted
          </p>
        </div>
      </div>
      <input
        className="mt-2 text-[#4A5568] w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
        value={formProps.initialValidator}
        onChange={(e) => setValue('formProps.initialValidator', e.target.value)}
      />

      {/* Theme */}
      <div className="relative inline-block text-left text-[#4A5568] w-full mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Theme</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setIsThemeDropdownOpen(!isThemeDropdownOpen)}
            type="button"
            className="w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <div className="flex items-center justify-center space-x-2.5">
              <p>{Object.values(THEME_MODES).find((item) => item.value === theme)?.label}</p>
            </div>

            <ChevronDownIcon />
          </button>
          {isThemeDropdownOpen && (
            <div
              className="absolute left-0 bottom-6 z-10 ml-1 mt-1 origin-top-right rounded-md shadow-xl bg-[#EDF2F7] rounded-xl w-full border border-white/20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {THEME_MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setValue('theme', m.value);
                    setIsThemeDropdownOpen(false);
                  }}
                  type="button"
                  className={classNames(
                    'flex items-center w-full px-4 py-2 text-sm hover:[#308D8A]/20 text-left hover:bg-[#308D8A]/50',
                  )}
                >
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Allowed modes */}
      <div className="relative inline-block text-left text-[#4A5568] w-full mt-5">
        <div>
          <p className="text-sm text-[#4A5568]/75">Allowed actions</p>
        </div>
        <div className="mt-4">
          <button
            onClick={() => setIsStakeModeDropdownOpen(!isStakeModeDropdownOpen)}
            type="button"
            className="w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <div className="flex items-center justify-center space-x-2.5">
              <p>{Object.values(ALLOWED_STAKE_MODES).find((item) => item.value === stakeMode)?.label}</p>
            </div>

            <ChevronDownIcon />
          </button>
          {isStakeModeDropdownOpen && (
            <div
              className="absolute left-0 bottom-6 z-10 ml-1 mt-1 origin-top-right rounded-md shadow-xl bg-[#EDF2F7] rounded-xl w-full border border-white/20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {ALLOWED_STAKE_MODES.map((m) => (
                <button
                  key={m.value}
                  onClick={() => {
                    setValue('stakeMode', m.value);
                    setIsStakeModeDropdownOpen(false);
                  }}
                  type="button"
                  className={classNames(
                    'flex items-center w-full px-4 py-2 text-sm hover:[#308D8A]/20 text-left hover:bg-[#308D8A]/50',
                  )}
                >
                  <span>{m.label}</span>
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div className="relative inline-block text-left text-[#4A5568] w-full mt-5">
        <p
          className="text-[#4A5568] mt-8 text-sm font-semibold flex justify-between items-center cursor-pointer"
          onClick={() => setIsPaletteDropdownOpen(!isPaletteDropdownOpen)}
        >
          Customize theme {isPaletteDropdownOpen ? <ChevronUpIcon /> : <ChevronDownIcon />}{' '}
        </p>

        {isPaletteDropdownOpen && (
          <div>
            <p className="text-sm text-[#4A5568]/75">Light</p>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Primary</p>
              </div>
              <InputColor
                placement="left"
                initialValue={palette.primaryLight}
                onChange={(color) => setValue('palette.primaryLight', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Secondary</p>
              </div>
              <InputColor
                initialValue={palette.secondaryLight}
                onChange={(color) => setValue('palette.secondaryLight', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Primary BG</p>
              </div>
              <InputColor
                initialValue={palette.primaryBgLight}
                onChange={(color) => setValue('palette.primaryBgLight', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Secondary BG</p>
              </div>
              <InputColor
                initialValue={palette.secondaryBgLight}
                onChange={(color) => setValue('palette.secondaryBgLight', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Text</p>
              </div>
              <InputColor
                initialValue={palette.textLight}
                onChange={(color) => setValue('palette.textLight', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Disabled</p>
              </div>
              <InputColor
                initialValue={palette.disabledTextLight}
                onChange={(color) => setValue('palette.disabledTextLight', color.hex)}
              />
            </div>
            <p className="text-sm text-[#4A5568]/75">Dark</p>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Primary</p>
              </div>
              <InputColor
                initialValue={palette.primaryDark}
                onChange={(color) => setValue('palette.primaryDark', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Secondary</p>
              </div>
              <InputColor
                initialValue={palette.secondaryDark}
                onChange={(color) => setValue('palette.secondaryDark', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Primary BG</p>
              </div>
              <InputColor
                initialValue={palette.primaryBgDark}
                onChange={(color) => setValue('palette.primaryBgDark', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Secondary BG</p>
              </div>
              <InputColor
                initialValue={palette.secondaryBgDark}
                onChange={(color) => setValue('palette.secondaryBgDark', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Text</p>
              </div>
              <InputColor
                initialValue={palette.textDark}
                onChange={(color) => setValue('palette.textDark', color.hex)}
              />
            </div>
            <div className="flex justify-between mt-5">
              <div>
                <p className="text-xs text-[#4A5568]/30">Disabled</p>
              </div>
              <InputColor
                initialValue={palette.disabledTextDark}
                onChange={(color) => setValue('palette.disabledTextDark', color.hex)}
              />
            </div>
          </div>
        )}
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
        <p className="text-[#4A5568] text-sm">Preferred Explorer</p>
        <p className="text-xs text-[#4A5568]/30">Links to transactions will use this explorer</p>
        <div className="mt-4">
          <button
            onClick={() => setIsExplorerDropdownOpen(!isExplorerDropdownOpen)}
            type="button"
            className="w-full flex justify-between items-center space-x-2 text-left rounded-md bg-white/10 px-4 py-2 text-sm font-medium shadow-sm border border-white/10"
            id="menu-button"
            aria-expanded="true"
            aria-haspopup="true"
          >
            <div className="flex items-center justify-center space-x-2.5">
              <p>{Object.values(AVAILABLE_EXPLORER).find((item) => item.name === defaultExplorer)?.name}</p>
            </div>

            <ChevronDownIcon />
          </button>

          {isExplorerDropdownOpen ? (
            <div
              className="absolute left-0 bottom-6 z-10 ml-1 mt-1 origin-top-right rounded-md shadow-xl bg-[#EDF2F7] rounded-xl w-full border border-white/20"
              role="menu"
              aria-orientation="vertical"
              aria-labelledby="menu-button"
            >
              {AVAILABLE_EXPLORER.map((item, index) => (
                <button
                  key={index}
                  onClick={() => {
                    setValue('defaultExplorer', item.name);
                    setIsExplorerDropdownOpen(false);
                  }}
                  type="button"
                  className={classNames(
                    'flex items-center w-full px-4 py-2 text-sm hover:[#308D8A]/20 text-left hover:bg-[#308D8A]/50',
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
