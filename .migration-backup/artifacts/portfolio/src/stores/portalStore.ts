import { create } from 'zustand';

interface PortalStore {
  activePortalId: string | null;
  setActivePortal: (activePortalId: string | null) => void;
}

export const usePortalStore = create<PortalStore>((set) => ({
  activePortalId: null,
  setActivePortal: (activePortalId) => set(() => ({ activePortalId })),
}))

if (import.meta.env.DEV && typeof window !== 'undefined') {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  (window as any).__portalStore = usePortalStore;
}
