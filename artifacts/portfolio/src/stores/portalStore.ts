import { create } from 'zustand';
import { track } from '../lib/devkitTracker';

interface PortalStore {
  activePortalId: string | null;
  setActivePortal: (activePortalId: string | null) => void;
}

let _portalOpenedAt: number | null = null;

export const usePortalStore = create<PortalStore>((set, get) => ({
  activePortalId: null,
  setActivePortal: (activePortalId) => {
    const prev = get().activePortalId;
    if (prev !== activePortalId) {
      if (activePortalId) {
        _portalOpenedAt = Date.now();
        track({ kind: 'portal_open', target: `portal:${activePortalId}` });
      } else if (prev) {
        const durationMs = _portalOpenedAt != null ? Date.now() - _portalOpenedAt : undefined;
        _portalOpenedAt = null;
        track({ kind: 'portal_close', target: `portal:${prev}`, durationMs });
      }
    }
    set(() => ({ activePortalId }));
  },
}));

if (import.meta.env.DEV && typeof window !== 'undefined') {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (window as any).__portalStore = usePortalStore;
}
