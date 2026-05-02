

import { useEffect, useState } from 'react'
import { useGLTF } from '@react-three/drei'
import WindowModel from '../models/WindowModel'

const HERO_MODELS = [WindowModel];

const DEFERRED_MODEL_URLS = [
  'models/dalithe_persistence_of_memory.glb',
  'models/wanderer_above_the_sea_of_fog.glb',
];

const Preloader = () => {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    setTimeout(() => {
      setVisible(false);
    }, 0);

    const idle = (window as unknown as {
      requestIdleCallback?: (cb: () => void, opts?: { timeout: number }) => number;
    }).requestIdleCallback;

    const schedule = (cb: () => void) => {
      if (typeof idle === 'function') {
        idle(cb, { timeout: 4000 });
      } else {
        setTimeout(cb, 2000);
      }
    };

    schedule(() => {
      DEFERRED_MODEL_URLS.forEach((url) => {
        try {
          useGLTF.preload(url);
        } catch {
          // swallow — model will still load on demand when its portal opens
        }
      });
    });
  }, []);

  return (<>
    {HERO_MODELS.map((Component, index) => (
      <Component key={index} visible={visible}/>
    ))}
  </>)
}

export default Preloader;
