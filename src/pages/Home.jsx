import Navbar from "../components/Navbar/Navbar";
import Hero from "../components/Hero/Hero";
import Stats from "../components/Stats/Stats";
import Features from "../components/Features/Features";


function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Stats />
      <Features/>
    </>
  );
}

export default Home;