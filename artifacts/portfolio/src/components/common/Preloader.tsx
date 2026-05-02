// The hero <WindowModel/> is rendered directly by <Hero/>, and the
// model module already calls useGLTF.preload at import time, so no
// extra preload pass is needed here. Component kept as a no-op to
// preserve the existing CanvasLoader import surface.
const Preloader = () => null;

export default Preloader;
