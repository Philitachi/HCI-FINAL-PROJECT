import { useEffect, useRef, useState } from 'react';

export const DEFAULT_DEV_SKELETON_DELAY_MS = 1500;
export const DEBUG_SKELETON_STORAGE_KEY = 'debugSkeletons';

export const getDebugSkeletonDelay = () => {
  if (typeof window !== 'undefined') {
    const storedMode = window.localStorage.getItem(DEBUG_SKELETON_STORAGE_KEY);

    if (storedMode === 'off') {
      return 0;
    }

    if (storedMode === 'on') {
      return DEFAULT_DEV_SKELETON_DELAY_MS;
    }
  }

  return import.meta.env.DEV ? DEFAULT_DEV_SKELETON_DELAY_MS : 0;
};

const useDebugLoadingGate = (loading) => {
  const [showLoading, setShowLoading] = useState(loading);
  const loadStartedAtRef = useRef(loading ? Date.now() : 0);

  useEffect(() => {
    const debugDelayMs = getDebugSkeletonDelay();

    if (debugDelayMs === 0) {
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
