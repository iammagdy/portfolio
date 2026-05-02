import { useCallback, useEffect, useRef } from "react";

import { useTiltStore } from "@stores";

const TILT_RANGE_DEG = 18;

const clamp = (v: number, min: number, max: number) => Math.min(max, Math.max(min, v));

type IOSDeviceOrientationEvent = typeof DeviceOrientationEvent & {
  requestPermission?: () => Promise<'granted' | 'denied'>;
};

const needsIOSPermission = () => {
  if (typeof window === 'undefined') return false;
  const Ctor = window.DeviceOrientationEvent as IOSDeviceOrientationEvent | undefined;
  return !!Ctor && typeof Ctor.requestPermission === 'function';
};

const isMobileViewport = () => typeof window !== 'undefined' && window.innerWidth < 768;

export const useDeviceTilt = () => {
  const setTilt = useTiltStore((s) => s.setTilt);
  const setPermissionState = useTiltStore((s) => s.setPermissionState);
  const setIsListening = useTiltStore((s) => s.setIsListening);
  const isListening = useTiltStore((s) => s.isListening);
  const permissionState = useTiltStore((s) => s.permissionState);

  const baselineRef = useRef<{ beta: number; gamma: number } | null>(null);
  const handlerRef = useRef<((e: DeviceOrientationEvent) => void) | null>(null);

  const startListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (handlerRef.current) return;

    const handle = (e: DeviceOrientationEvent) => {
      if (e.beta == null || e.gamma == null) return;

      if (!baselineRef.current) {
        baselineRef.current = { beta: e.beta, gamma: e.gamma };
      }

      const dBeta = e.beta - baselineRef.current.beta;
      const dGamma = e.gamma - baselineRef.current.gamma;

      const tiltX = clamp(dGamma / TILT_RANGE_DEG, -1, 1);
      const tiltY = clamp(dBeta / TILT_RANGE_DEG, -1, 1);
      setTilt(tiltX, tiltY);
    };

    handlerRef.current = handle;
    window.addEventListener('deviceorientation', handle, true);
    setIsListening(true);
  }, [setTilt, setIsListening]);

  const stopListening = useCallback(() => {
    if (typeof window === 'undefined') return;
    if (!handlerRef.current) return;
    window.removeEventListener('deviceorientation', handlerRef.current, true);
    handlerRef.current = null;
    setIsListening(false);
    setTilt(0, 0);
  }, [setTilt, setIsListening]);

  const requestPermission = useCallback(async () => {
    if (typeof window === 'undefined') return;
    const Ctor = window.DeviceOrientationEvent as IOSDeviceOrientationEvent | undefined;
    if (!Ctor) {
      setPermissionState('unsupported');
      return;
    }
    if (typeof Ctor.requestPermission === 'function') {
      try {
        setPermissionState('pending');
        const result = await Ctor.requestPermission();
        if (result === 'granted') {
          setPermissionState('granted');
          startListening();
        } else {
          setPermissionState('denied');
        }
      } catch {
        setPermissionState('denied');
      }
    } else {
      setPermissionState('granted');
      startListening();
    }
  }, [setPermissionState, startListening]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!isMobileViewport()) return;

    if (!('DeviceOrientationEvent' in window)) {
      setPermissionState('unsupported');
      return;
    }

    if (!needsIOSPermission()) {
      setPermissionState('granted');
      startListening();
    }
  }, [setPermissionState, startListening]);

  useEffect(() => {
    return () => {
      stopListening();
    };
  }, [stopListening]);

  return { permissionState, isListening, requestPermission };
};
