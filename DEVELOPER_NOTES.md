# Developer Notes

To develop, `pnpm i && pnpm dev`
To build, `pnpm build-widget`

There's a few point of entry for Terminal, and each has specific reasons:

- https://github.com/solendprotocol/marinade-widget/blob/main/src/index.tsx (RenderMarinade)
  - This houses all app-related contexts including wallets, accounts, screens, hooks
- https://github.com/solendprotocol/marinade-widget/blob/main/src/pages/_app.tsx (NextJS)
  - This is our Terminal homepage, and preview link
  - It's also the Playground for templates, toggles, and Codeblocks generation
- https://github.com/solendprotocol/marinade-widget/blob/main/src/components/Marinade.tsx (MarinadeApp)
  - This is the actual Marinade app
- https://github.com/solendprotocol/marinade-widget/blob/main/src/library.tsx (Injection script)
  - This is how we inject Marinade and pass props into Marinade App

Why the separation?

- Webpack is configured specifically to only build MarinadeApp and Injection Script for bundle size reasons
- The separation also allows us to develop/test the app like how an integrator would integrate us
- Components can be used in NextJS preview, and also in MarinadeApp
  - If you want to add more features, for e.g bringing features to the widget, I suggest you start from MarinadeApp
  - If you want to add customisability, you need to check Injection script
  - If you want to showcase more features, edit NextJS
