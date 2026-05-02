import { useThree } from '@react-three/fiber';
import { useEffect, useState } from 'react';

export const SMALL_BREAKPOINT = 640;
export const MOBILE_BREAKPOINT = 768;
export const TABLET_BREAKPOINT = 1024;

export const useIsMobileR3F = (): boolean => {
  const { size } = useThree();
  return size.width < MOBILE_BREAKPOINT;
};

export const useIsMobileDOM = (): boolean => {
  const [isMobile, setIsMobile] = useState(
    () => typeof window !== 'undefined' && window.innerWidth < MOBILE_BREAKPOINT,
  );
  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);
  return isMobile;
};
