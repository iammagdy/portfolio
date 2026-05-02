import { useState } from 'react'
import WindowModel from '../models/WindowModel'

const HERO_MODELS = [WindowModel];

// The hero <WindowModel/> is mounted eagerly above so its GLB starts
// downloading during the initial paint. Memory + Wanderer are mounted
// eagerly inside their portal scenes (Work/Projects) on desktop, so they
// also load up-front from the same Canvas — no separate preload pass is
// needed and the previous deferred useGLTF.preload calls were just
// duplicating work the renderer was already doing.

const Preloader = () => {
  const [visible] = useState(true);

  return (
    <>
      {HERO_MODELS.map((Component, index) => (
        <Component key={index} visible={visible} />
      ))}
    </>
  );
};

export default Preloader;
