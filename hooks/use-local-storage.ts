'use client';

import { useCallback, useSyncExternalStore } from 'react';

const snapshotCache = new Map<string, { raw: string | null; parsed: unknown }>();
const listeners = new Map<string, Set<() => void>>();

function emitChange(key: string) {
  const keyListeners = listeners.get(key);
  if (keyListeners) {
    keyListeners.forEach((listener) => listener());
  }
}

export function useLocalStorageState<T>(
  key: string,
  initialValue: T
): [T, (next: T | ((prev: T) => T)) => void, () => void] {
  const subscribe = useCallback(
    (listener: () => void) => {
      let set = listeners.get(key);
      if (!set) {
        set = new Set();
        listeners.set(key, set);
      }
      set.add(listener);

      const handleStorage = (e: StorageEvent) => {
        if (e.key === key) listener();
      };
      window.addEventListener('storage', handleStorage);
      return () => {
        set?.delete(listener);
        window.removeEventListener('storage', handleStorage);
      };
    },
    [key]
  );

  const getSnapshot = useCallback((): T => {
    try {
      const raw = window.localStorage.getItem(key);
      if (raw === null) {
        return initialValue;
      }
      const cached = snapshotCache.get(key);
      if (cached && cached.raw === raw) {
        return cached.parsed as T;
      }
      const parsed = JSON.parse(raw) as T;
      snapshotCache.set(key, { raw, parsed });
      return parsed;
    } catch {
      return initialValue;
    }
  }, [key, initialValue]);

  const getServerSnapshot = useCallback((): T => initialValue, [initialValue]);

  const value = useSyncExternalStore(subscribe, getSnapshot, getServerSnapshot);

  const setValue = useCallback(
    (updater: T | ((prev: T) => T)) => {
      try {
        const current = getSnapshot();
        const resolved =
          typeof updater === 'function'
            ? (updater as (prev: T) => T)(current)
            : updater;
        const raw = JSON.stringify(resolved);
        snapshotCache.set(key, { raw, parsed: resolved });
        window.localStorage.setItem(key, raw);
        emitChange(key);
      } catch {
        // Ignore storage write errors
      }
    },
    [key, getSnapshot]
  );

  const resetValue = useCallback(() => {
    try {
      snapshotCache.delete(key);
      window.localStorage.removeItem(key);
      emitChange(key);
    } catch {
      // Ignore storage errors
    }
  }, [key]);

  return [value, setValue, resetValue];
}
