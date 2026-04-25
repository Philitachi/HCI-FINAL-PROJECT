import { useEffect, useRef, useState } from 'react';

export const DEBUG_SKELETON_STORAGE_KEY = 'fsis-debug-skeletons';

const DEV_SKELETON_DELAY_MS = 1500;

const getDebugSkeletonDelay = () => {
  if (!import.meta.env.DEV) {
    return 0;
  }

  if (typeof window === 'undefined') {
    return DEV_SKELETON_DELAY_MS;
  }

  return window.localStorage.getItem(DEBUG_SKELETON_STORAGE_KEY) === 'off'
    ? 0
    : DEV_SKELETON_DELAY_MS;
};

const useDebugLoadingGate = (loading) => {
  const [showLoading, setShowLoading] = useState(loading);
  const loadStartedAtRef = useRef(0);

  useEffect(() => {
    const debugDelayMs = getDebugSkeletonDelay();

    if (debugDelayMs === 0) {
      // Keep loading state synchronized when the debug skeleton delay is disabled.
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setShowLoading(loading);
      return undefined;
    }

    if (loading) {
      loadStartedAtRef.current = Date.now();
      setShowLoading(true);
      return undefined;
    }

    const startedAt = loadStartedAtRef.current || Date.now();
    const elapsed = Date.now() - startedAt;
    const remaining = Math.max(debugDelayMs - elapsed, 0);

    const timeoutId = window.setTimeout(() => {
      setShowLoading(false);
      loadStartedAtRef.current = 0;
    }, remaining);

    return () => {
      window.clearTimeout(timeoutId);
    };
  }, [loading]);

  return showLoading;
};

export default useDebugLoadingGate;
