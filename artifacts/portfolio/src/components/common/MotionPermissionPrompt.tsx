import { useEffect, useState } from "react";

import { useDeviceTilt } from "../../hooks/use-device-tilt";

const MotionPermissionPrompt = () => {
  const { permissionState, requestPermission } = useDeviceTilt();
  const [isMobile, setIsMobile] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    const update = () => setIsMobile(window.innerWidth < 768);
    update();
    window.addEventListener('resize', update);
    return () => window.removeEventListener('resize', update);
  }, []);

  if (!isMobile) return null;
  if (dismissed) return null;
  if (permissionState !== 'unknown' && permissionState !== 'denied') return null;

  const isDenied = permissionState === 'denied';

  return (
    <div
      className="fixed top-4 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-black/70 backdrop-blur-sm border border-white/20 text-white flex items-center gap-3 max-w-[calc(100vw-5rem)]"
    >
      <span className="text-xs sm:text-sm">
        {isDenied
          ? 'Motion access denied'
          : 'Tilt your phone to look around'}
      </span>
      {!isDenied && (
        <button
          type="button"
          onClick={requestPermission}
          className="text-xs sm:text-sm font-medium px-3 py-1 rounded-full bg-white text-black hover:opacity-90 transition"
        >
          Enable
        </button>
      )}
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label="Dismiss"
        className="text-white/60 hover:text-white text-base leading-none px-1"
      >
        ×
      </button>
    </div>
  );
};

export default MotionPermissionPrompt;
