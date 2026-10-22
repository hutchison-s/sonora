'use client';
import { useEffect, useState } from 'react';
import { DEFAULT_PROGRESS, readProgress, type ProgressState } from './storage';
export function useProgress(): [ProgressState, boolean] {
  const [state, setState] = useState<ProgressState>(DEFAULT_PROGRESS);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const sync = () => setState(readProgress());
    sync(); setReady(true);
    window.addEventListener('sonora:updated', sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener('sonora:updated', sync); window.removeEventListener('storage', sync); };
  }, []);
  return [state, ready];
}
