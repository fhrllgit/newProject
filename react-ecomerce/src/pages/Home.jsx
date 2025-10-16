import Hero from "../components/Hero";
import Services from "../components/service";
import Footer from "../components/Footer";   // pastikan nama file bener
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <>
      <Navbar />
      <Hero />
      <Services />
      <Footer />
    </>
  );
}
