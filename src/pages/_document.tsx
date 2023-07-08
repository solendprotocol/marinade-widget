import Document, { Html, Head, Main, NextScript, DocumentContext } from 'next/document';

class MyDocument extends Document {
  render() {
    return (
      <Html>
        <Head>
          <meta charSet="utf-8" />
          <link rel="icon" href="/favicon-96x96.png" />
          <meta name="theme-color" content="#103145" />

          <meta
            name="description"
            content="Marinade Terminal: An open-sourced, lite version of Marinade that provides end-to-end swap flow."
          />

          <link rel="manifest" href="/manifest.json" crossOrigin="use-credentials" />
          <link rel="apple-touch-icon" href="/apple-icon-57x57.png" />
          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="use-credentials" />
          <link
            href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Maven+Pro:wght@400;500;600;700;800;900&display=swap"
            rel="stylesheet"
          />
        </Head>
        {/* Default to dark mode */}
        <body className="text-black dark:text-[#4A5568]">
          <Main />
          <NextScript />
        </body>
      </Html>
    );
  }
}

export default MyDocument;
