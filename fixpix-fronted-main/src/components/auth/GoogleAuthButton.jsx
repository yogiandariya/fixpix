import React, { useEffect, useMemo, useRef, useState } from 'react';
import { GoogleLogin } from '@react-oauth/google';

const RENDER_RETRY_DELAYS_MS = [400, 1200, 2400];

export default function GoogleAuthButton({
  onSuccess,
  onError,
  isDark,
  text = 'continue_with',
}) {
  const containerRef = useRef(null);
  const [renderKey, setRenderKey] = useState(0);
  const [isRendered, setIsRendered] = useState(false);

  const hasGoogleButton = () => {
    const root = containerRef.current;
    if (!root) return false;

    return Boolean(
      root.querySelector('iframe') ||
      root.querySelector('[role="button"]') ||
      root.querySelector('.nsm7Bb-HzV7m-LgbsSe')
    );
  };

  useEffect(() => {
    const root = containerRef.current;
    if (!root) return;

    const syncRenderedState = () => {
      if (hasGoogleButton()) {
        setIsRendered(true);
      }
    };

    syncRenderedState();

    const observer = new MutationObserver(syncRenderedState);
    observer.observe(root, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, [renderKey]);

  useEffect(() => {
    setIsRendered(false);

    const timers = RENDER_RETRY_DELAYS_MS.map((delay) =>
      window.setTimeout(() => {
        if (!hasGoogleButton()) {
          setRenderKey((k) => k + 1);
        }
      }, delay)
    );

    return () => timers.forEach((timer) => window.clearTimeout(timer));
  }, [renderKey]);

  useEffect(() => {
    const onVisible = () => {
      if (document.visibilityState === 'visible' && !hasGoogleButton()) {
        setRenderKey((k) => k + 1);
      }
    };

    document.addEventListener('visibilitychange', onVisible);
    window.addEventListener('focus', onVisible);

    return () => {
      document.removeEventListener('visibilitychange', onVisible);
      window.removeEventListener('focus', onVisible);
    };
  }, []);

  const googleTheme = useMemo(() => (isDark ? 'filled_black' : 'outline'), [isDark]);

  return (
    <div className="w-full" ref={containerRef}>
      <div className="flex justify-center w-full min-h-[46px]">
        <GoogleLogin
          key={`google-auth-${renderKey}`}
          onSuccess={onSuccess}
          onError={onError}
          theme={googleTheme}
          shape="pill"
          size="large"
          width={330}
          text={text}
          useOneTap={false}
        />
      </div>

      {!isRendered && (
        <div className="mt-2 text-center">
          <button
            type="button"
            onClick={() => setRenderKey((k) => k + 1)}
            className="text-[11px] font-semibold text-[var(--accent)] hover:underline"
          >
            Having trouble loading Google button? Retry
          </button>
        </div>
      )}
    </div>
  );
}
