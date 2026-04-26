import CanvasLoader from "./components/common/CanvasLoader";
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
    </>
  );
};

export default Home;
