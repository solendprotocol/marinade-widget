import { createRoot } from 'react-dom/client';
import { IInit } from './types';

import 'tailwindcss/tailwind.css';
import { useMediaQuery } from 'react-responsive';
import { CSSProperties, useEffect, useMemo, useState } from 'react';
import MarinadeCircle from './icons/MarinadeCircle';
import { INITIAL_FORM_CONFIG } from './constants';

const containerId = 'marinade-terminal';
const packageJson = require('../package.json');
const bundleName = `main-${packageJson.version}`;

const scriptDomain =
  (() => {
    if (typeof window === 'undefined') return '';

    const url = (document.currentScript as HTMLScriptElement)?.src;
    if (url) {
      return new URL(url).origin;
    }
    return '';
  })() || 'https://marinade-widget-delta.vercel.app';

async function loadRemote(id: string, href: string, type: 'text/javascript' | 'stylesheet') {
  return new Promise((res, rej) => {
    const existing = document.getElementById(id) as HTMLLinkElement | null;

    if (existing) {
      res({});
    } else {
      let el: HTMLScriptElement | HTMLLinkElement =
        type === 'text/javascript' ? document.createElement('script') : document.createElement('link');

      el.id = id;
      el.onload = res;
      el.onerror = rej;
      if (el instanceof HTMLScriptElement) {
        el.type = 'text/javascript';
        el.src = href;
      } else if (el instanceof HTMLLinkElement) {
        el.rel = 'stylesheet';
        el.href = href;
      }

      document.head.append(el);
    }
  });
}

async function loadMarinade() {
  if (process.env.NODE_ENV === 'development') {
    return;
  }

  try {
    // Load all the scripts and styles
    await Promise.all([
      loadRemote('marinade-load-script-app', `${scriptDomain}/${bundleName}-app.js`, 'text/javascript'),
      loadRemote('marinade-load-styles-tailwind', `${scriptDomain}/${bundleName}-Tailwind.css`, 'stylesheet'),
      loadRemote('marinade-load-styles-preflight', `${scriptDomain}/scoped-preflight.css`, 'stylesheet'),
    ]);
    // The sequence matters! the last imported Marinade.css takes precendent
    loadRemote('marinade-load-styles-marinade', `${scriptDomain}/${bundleName}-Marinade.css`, 'stylesheet');
  } catch (error) {
    console.error(`Error loading Marinade Terminal: ${error}`);
    throw new Error(`Error loading Marinade Terminal: ${error}`);
  }
}

const defaultStyles: CSSProperties = {
  zIndex: 50,
};

const RenderLoadableMarinade = (props: IInit) => {
  const [loaded, setLoaded] = useState(false);
  useEffect(() => {
    loadMarinade();

    let intervalId: NodeJS.Timer;
    if (!loaded) {
      intervalId = setInterval(() => {
        const instance = (window as any).MarinadeRenderer?.RenderMarinade;
        if (instance) {
          setLoaded(true);
        }
      }, 50);
    }
    return () => {
      clearInterval(intervalId);
    };
  }, [loaded]);

  const RenderMarinade: (props: any) => JSX.Element = useMemo(() => {
    if (loaded) {
      return (window as any).MarinadeRenderer.RenderMarinade;
    }

    return EmptyJSX;
  }, [loaded]);

  return <RenderMarinade {...props} scriptDomain={scriptDomain} />;
};

const EmptyJSX = () => <></>;
const RenderShell = (props: IInit) => {
  const displayMode = props.displayMode;
  const containerStyles = props.containerStyles;
  const containerClassName = props.containerClassName;
  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });

  const displayClassName = useMemo(() => {
    // Default Modal
    if (!displayMode || displayMode === 'modal') {
      return 'fixed top-0 w-screen h-screen flex items-center justify-center bg-black/50';
    } else if (displayMode === 'integrated' || displayMode === 'widget') {
      return 'flex items-center justify-center w-full h-full';
    }
  }, [displayMode]);

  const contentClassName = useMemo(() => {
    // Default Modal
    if (!displayMode || displayMode === 'modal') {
      return `flex flex-col h-screen w-screen max-h-[90vh] md:max-h-[600px] max-w-[360px] overflow-auto text-black relative rounded-lg webkit-scrollbar ${
        containerClassName || ''
      } p-4 h-fit`;
    } else if (displayMode === 'integrated' || displayMode === 'widget') {
      return 'flex flex-col h-full w-full overflow-auto text-black relative webkit-scrollbar p-4';
    }
  }, [displayMode]);

  const onClose = () => {
    if (window.Marinade) {
      window.Marinade.close();
    }
  };

  return (
    <div className={displayClassName}>
      {/* eslint-disable @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Maven+Pro:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />

      <div
        style={{
          ...defaultStyles,
          ...containerStyles,
          background:
            (systemPrefersDark && props.theme !== 'light') || props.theme === 'dark'
              ? props.palette?.primaryBgDark ?? INITIAL_FORM_CONFIG.palette.primaryBgDark
              : props.palette?.primaryBgLight ?? INITIAL_FORM_CONFIG.palette.primaryBgLight,
        }}
        className={contentClassName}
      >
        <RenderLoadableMarinade {...props} />
      </div>

      {!displayMode || displayMode === 'modal' ? (
        <div onClick={onClose} className="absolute w-screen h-screen top-0 left-0" />
      ) : null}
    </div>
  );
};

const RenderWidgetShell = (props: IInit) => {
  const [isOpen, setIsOpen] = useState(false);

  const systemPrefersDark = useMediaQuery({
    query: '(prefers-color-scheme: dark)',
  });
  const classes = useMemo(() => {
    const size = props.widgetStyle?.size || 'default';

    let result: { containerClassName: string; contentClassName: string } | undefined = undefined;
    if (!props.widgetStyle?.position || props.widgetStyle?.position === 'bottom-right') {
      result = {
        containerClassName: 'bottom-6 right-6',
        contentClassName: size === 'default' ? 'bottom-[60px] -right-3' : 'bottom-[44px] -right-4',
      };
    }
    if (props.widgetStyle?.position === 'bottom-left') {
      result = {
        containerClassName: 'bottom-6 left-6',
        contentClassName: size === 'default' ? 'bottom-[60px] -left-3' : 'bottom-[44px] -left-4',
      };
    }
    if (props.widgetStyle?.position === 'top-left') {
      result = {
        containerClassName: 'top-6 left-6',
        contentClassName: size === 'default' ? 'top-[60px] -left-3' : 'top-[44px] -left-4',
      };
    }
    if (props.widgetStyle?.position === 'top-right') {
      result = {
        containerClassName: 'top-6 right-6',
        contentClassName: size === 'default' ? 'top-[60px] -right-3' : 'top-[44px] -right-4',
      };
    }

    return {
      ...result,
      widgetContainerClassName: size === 'default' ? 'h-14 w-14' : 'h-10 w-10',
      widgetLogoSize: size === 'default' ? 42 : 32,
    };
  }, [props.widgetStyle?.position, props.widgetStyle?.size]);

  return (
    <div className={`fixed ${classes.containerClassName}`}>
      {/* eslint-disable @next/next/no-page-custom-font */}
      <link
        href="https://fonts.googleapis.com/css2?family=Inter:wght@600&family=Maven+Pro:wght@400;500;600;700;800;900&display=swap"
        rel="stylesheet"
      />
      <div
        className={`${classes.widgetContainerClassName} rounded-full bg-white/75 flex items-center justify-center cursor-pointer`}
        onClick={() => setIsOpen(!isOpen)}
      >
        <MarinadeCircle width={classes.widgetLogoSize} height={classes.widgetLogoSize} />
      </div>

      <div
        id="integrated-terminal"
        className={`p-4 absolute overflow-hidden ${
          classes.contentClassName
        } flex flex-col w-[90vw] max-w-[384px] max-h-[75vh] rounded-2xl transition-opacity duration-300 shadow-2xl ${
          !isOpen ? 'h-0 opacity-0' : 'opacity-100'
        }`}
        style={{
          background:
            (systemPrefersDark && props.theme !== 'light') || props.theme === 'dark'
              ? props.palette?.primaryBgDark ?? INITIAL_FORM_CONFIG.palette.primaryBgDark
              : props.palette?.primaryBgLight ?? INITIAL_FORM_CONFIG.palette.primaryBgLight,
        }}
      >
        <RenderLoadableMarinade {...props} />
      </div>
    </div>
  );
};

async function init(props: IInit) {
  const { passThroughWallet, onStakeError, onSuccess, integratedTargetId, ...restProps } = props;
  const targetDiv = document.createElement('div');
  const instanceExist = document.getElementById(containerId);

  // Remove previous instance
  if (instanceExist) {
    window.Marinade._instance = null;
    instanceExist?.remove();
  }

  targetDiv.id = containerId;
  targetDiv.classList.add('w-full');
  targetDiv.classList.add('h-full');

  if (restProps.displayMode === 'integrated') {
    const target = document.getElementById(integratedTargetId!);
    if (!target) {
      throw new Error(`Marinade Terminal: document.getElementById cannot find ${integratedTargetId}`);
    }

    target?.appendChild(targetDiv);
  } else {
    document.body.appendChild(targetDiv);
  }

  let element;
  if (restProps.displayMode === 'widget') {
    element = <RenderWidgetShell {...props} />;
  } else {
    element = <RenderShell {...props} />;
  }
  const root = createRoot(targetDiv);
  root.render(element);
  window.Marinade.root = root;
  window.Marinade._instance = element;

  // Passthrough & Callbacks
  window.Marinade.passThroughWallet = passThroughWallet;
  window.Marinade.onStakeError = onStakeError;
  window.Marinade.onSuccess = onSuccess;
}

const attributes = (document.currentScript as HTMLScriptElement)?.attributes;
if (typeof window !== 'undefined') {
  document.onreadystatechange = function () {
    const loadComplete = document.readyState === 'complete';
    const shouldPreload = Boolean(attributes.getNamedItem('data-preload'));

    if (loadComplete && shouldPreload) {
      setTimeout(() => {
        loadMarinade().catch((error) => {
          console.error(`Error pre-loading Marinade Terminal: ${error}`);
          throw new Error(`Error pre-loading Marinade Terminal: ${error}`);
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

const close = () => {
  const targetDiv = document.getElementById(containerId);
  if (targetDiv) {
    targetDiv.style.display = 'none';
  }
};

export { init, resume, close };
