import CanvasLoader from "./components/common/CanvasLoader";
import MobileProjectsOverlay from "./components/common/MobileProjectsOverlay";
import MobileWorkOverlay from "./components/common/MobileWorkOverlay";
import MotionPermissionPrompt from "./components/common/MotionPermissionPrompt";
import ScrollWrapper from "./components/common/ScrollWrapper";
import Experience from "./components/experience";
import Footer from "./components/footer";
import Hero from "./components/hero";

const Home = () => {
  return (
    <>
      <CanvasLoader>
        <ScrollWrapper>
          <Hero/>
          <Experience/>
          <Footer/>
        </ScrollWrapper>
      </CanvasLoader>
      <MotionPermissionPrompt />
      <MobileProjectsOverlay />
      <MobileWorkOverlay />
    </>
  );
};

export default Home;
