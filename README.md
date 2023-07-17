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
<script src="https://marinade-widget-delta.vercel.app/main-v1.js" data-preload />
```

### Preloading Terminal

Assign the attribute `data-preload` to the script tag, the full application will be preloaded on your browser's `(document.readyState === "complete")` event.

```tsx
<script src="https://marinade-widget-delta.vercel.app/main-v1.js" data-preload />
```

Then,

```tsx
document.addEventListener('readystatechange', (e) => {
  if (document.readyState === 'complete') {
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

```tsx
window.Marinade.init({ displayMode: 'modal' });
```

### _*Integrated*_

Integrated mode renders Marinade Terminal as a part of your dApp.

```tsx
window.Marinade.init({ displayMode: 'integrated' });
```

### _*Widget*_

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

### Default Explorer

- `defaultExplorer?: 'Solana Explorer' | 'Solscan' | 'Solana Beach' | 'SolanaFM';`
- Default: `Solana Explorer`

The default explorer is set to `Solana Explorer`;

You can change the default explorer by passing in the explorer name to the `defaultExplorer` prop.

---

### onSuccess/onStakeError callback

`onSuccess()` reference can be provided, and will be called when swap is successful.

While `onStakeError()` will be called when an error has occurred.

```tsx
window.Marinade.init({
  onSuccess: ({ txid }) => {
    console.log({ txid });
  },
  onStakeError: ({ error }) => {
    console.log('onStakeError', error);
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

Since Marinade Terminal is not published on npm, and are only importable via CDN, to get proper typing, you can create a typing decalarion `marinade-terminal.d.ts` file in your project, and copy the contents in `src/types/index.d.ts`.

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
