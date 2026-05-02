import { create } from 'zustand';

export type TiltPermissionState = 'unknown' | 'unsupported' | 'pending' | 'granted' | 'denied';

interface TiltStore {
  tiltX: number;
  tiltY: number;
  permissionState: TiltPermissionState;
  isListening: boolean;
  setTilt: (x: number, y: number) => void;
  setPermissionState: (s: TiltPermissionState) => void;
  setIsListening: (v: boolean) => void;
}

export const useTiltStore = create<TiltStore>((set) => ({
  tiltX: 0,
  tiltY: 0,
  permissionState: 'unknown',
  isListening: false,
  setTilt: (tiltX, tiltY) => set(() => ({ tiltX, tiltY })),
  setPermissionState: (permissionState) => set(() => ({ permissionState })),
  setIsListening: (isListening) => set(() => ({ isListening })),
}));
