# Marinade Terminal

Marinade Terminal is an open-sourced, lite version of Marinade that provides end-to-end swap flow by linking it in your HTML.

Visit our Demo / Playground over at https://marinade-widget-delta.vercel.app

With several templates to get you started, and auto generated code snippets.

---

## Core features

- `main-v1.js` bundle ~70Kb gzipped
  - app bundle (~1.1Mb) are loaded on-demand when `init()` is called
  - alternatively, preload app bundle with `data-preload` attributes
- Several major built-in wallets, or passthrough wallets from your dApp
- Flexbile display modes, `Modal`, `Integrated`, or `Widget`.
- Flexible form customisation, e.g. Full swap experience, Payment flow.
- Fee supports
- Support ExactIn, and ExactOut swap mode
- Auto wallet detection for Versioned Tx.
- Price API integration, high precisions and meme tokens

---

## Getting started

### Integrating the widget

In your document, link and embed `main-v1.js`.

```tsx
<script src="https://terminal.jup.ag/main-v1.js" data-preload />
```

### Preloading Terminal

Assign the attribute `data-preload` to the script tag, the full application will be preloaded on your browser's `(document.readyState === "complete")` event.

```tsx
<script src="https://terminal.jup.ag/main-v1.js" data-preload />
```

Then,

```tsx
document.addEventListener('readystatechange', e => {
  if (document.readyState === "complete") {
    window.Marinade.init({ endpoint: 'https://api.mainnet-beta.solana.com' });
  }
});
```

---

## Built-in wallets, or passthrough wallets from your dApp

_*Mode 1: Wallet passthrough*_

If your user have connected their wallet via your dApp, you may passthrough the wallet instance via the `init({ passThroughWallet: wallet })`.

```jsx
const App = () => {
  const { wallet } = useWallet();

  const initMarinade = () => {
    if (wallet) {
      window.Marinade.init({
        endpoint,
        passThroughWallet: wallet,
      });
    }
  };
};
```

_*Mode 2: Built-in wallet*_

If your user is not connected, Marinade Terminal have several built-in wallets that user can connect and perform swap directly.

---

### Modal, Integrated, or Widget mode.

### _*Modal*_

By default, Marinade renders as a modal and take up the whole screen.
<img src="public/demo/modal-demo.png" />

```tsx
window.Marinade.init({ displayMode: 'modal' });
```

### _*Integrated*_

Integrated mode renders Marinade Terminal as a part of your dApp.
<img src="public/demo/integrated-demo.png" />

```tsx
window.Marinade.init({ displayMode: 'integrated' });
```

### _*Widget*_

<img src="public/demo/widget-demo.png" />
Widget mode renders Marinade Terminal as a widget that can be placed at different position.

````tsx

```tsx
window.Marinade.init({
  displayMode: 'widget',
  widgetStyle: {
        position: 'bottom-right', // 'bottom-left', 'top-left', 'top-right'
        size: 'default', // 'sm'
      },
});
````

---

### Mode (Deprecated in v1)

Integrators on `mode` props needs to migrate to `formProps`, which offers more flexibility in customising interactions, and more capabilities.

Example on how to migrate from `mode` to `formProps`:

- `default`: Default mode, user can swap between any token pair. No action required.

- `outputOnly`: Output only mode, user can only swap to destination pair.

  ```ts
  // Can be mapped to:
  window.Marinade.init({
    endpoint: 'https://api.mainnet-beta.solana.com',
    formProps: {
      fixedInputMint: undefined,
      swapModeExactOut: undefined,
      fixedAmount: undefined,
      initialOutputMint: 'So11111111111111111111111111111111111111112',
      fixedOutputMint: true,
    },
  });
  ```

---

### formProps (Available on v1)

Configure Terminal's behaviour and allowed actions for your user

- swapMode?: `SwapMode.ExactIn | SwapMode.ExactOut`
  - Default to `ExactIn`, where user input the amount of token they want to swap.
  - On `ExactOut`, user input the desired amount of token they want to receive.
- initialAmount?: `string`
  - The initial amount
- initialInputMint?: `string`
  - The default input mint
  - can be used with `fixedInputMint`
- fixedInputMint?: `boolean`
  - must be used with `initialInputMint`
  - user cannot change the input mint
- initialOutputMint?: `string`
  - The default output mint
  - can be used with `fixedOutputMint`
- fixedOutputMint?: `boolean`
  - must be used with `initialInputMint`
  - user cannot change the input mint

---

### Resuming / Closing activity

- Everytime `init()` is called, it will create a new activity.

- If you want to resume the previous activity, you can use `resume()`.

- `close()` function only hide the widget.

```tsx
if (window.Marinade._instance) {
  window.Marinade.resume();
}

window.Marinade.close();
```

---

### Fee supports

Similar to Marinade, Marinade Terminal supports fee for integrators.

There are no protocol fees on Marinade, but integrators can introduce a platform fee on swaps. The platform fee is provided in basis points, e.g. 20 bps for 0.2% of the token output.

Refer to [Adding your own fees](https://docs.jup.ag/integrating-jupiter/additional-guides/adding-your-own-fees) docs for more details.

_Note: You will need to create the Token fee accounts to collect the platform fee._

```tsx
import { getPlatformFeeAccounts } from '@jup-ag/react-hook';

// Marinade Core provides a helper function that returns all your feeAccounts
const platformFeeAndAccounts = {
  feeBps: 50,
  feeAccounts: await getPlatformFeeAccounts(
    connection,
    new PublicKey('BUX7s2ef2htTGb2KKoPHWkmzxPj4nTWMWRgs5CSbQxf9'), // The platform fee account owner
  ), // map of mint to token account pubkey
};

window.Marinade.init({
  // ...
  platformFeeAndAccounts,
});
```

### Strict Token List
- `strictTokenList?: boolean;`
- Default: `true`

The strict list contains a smaller set of validated tokens. To see all tokens, toggle "off".

Learn more at: https://docs.jup.ag/api/token-list-api

---

### Default Explorer
- `defaultExplorer?: 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';`
- Default: `Solana Explorer`

The default explorer is set to `Solana Explorer`;

You can change the default explorer by passing in the explorer name to the `defaultExplorer` prop.

---

### onSuccess/onSwapError callback

`onSuccess()` reference can be provided, and will be called when swap is successful.

While `onSwapError()` will be called when an error has occurred.

```tsx
window.Marinade.init({
  onSuccess: ({ txid, swapResult }) => {
    console.log({ txid, swapResult });
  },
  onSwapError: ({ error }) => {
    console.log('onSwapError', error);
  },
});
```

### Customising styles: CSSProperties

Any CSS-in-JS can be injected to the outer-most container via containerStyles api.

Examples:

- Custom zIndex

```tsx
window.Marinade.init({
  // ...
  containerStyles: { zIndex: 100 },
});
```

- Custom height

```tsx
window.Marinade.init({
  // ...
  containerStyles: { maxHeight: '90vh' },
});
```

### Customising className: Tailwind className

Tailwind classes can be injected to the outer-most container via containerClassName api.

Example:

- Custom breakpoints

```tsx
window.Marinade.init({
  // ...
  containerClassName: 'max-h-[90vh] lg:max-h-[600px]',
});
```

---

### Typescript Support
Since Marinade Terminal is not published on npm, and are only importable via CDN, to get proper typing, you can create a typing decalarion `jupiter-terminal.d.ts` file in your project, and copy the contents in `src/types/index.d.ts`.

```tsx
declare global {
  interface Window {
    Marinade: MarinadeTerminal;
  }
}
// ...
// ...
// ...
```
