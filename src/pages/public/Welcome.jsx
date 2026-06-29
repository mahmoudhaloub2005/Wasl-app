import Navbar from "../../components/layout/Navbar/Navbar";
import Hero from "../../components/home/Hero/Hero";
import Stats from "../../components/home/Stats/Stats";
import Features from "../../components/home/Features/Features";
import CTA from "../../components/home/CTA/CTA.";
import Footer from "../../components/layout/Footer/Footer";

function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features />
      <CTA />
      <Footer />
    </>
  );
}

export default Home;