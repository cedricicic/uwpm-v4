import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import BarField from "@/components/BarField";
import About from "@/components/About";
import Events from "@/components/Events";
import Gallery from "@/components/Gallery";
import WorkedAt from "@/components/WorkedAt";
import Footer from "@/components/Footer";
import Motion from "@/components/Motion";

export default function Home() {
  return (
    <>
      <Nav />

      <main className="page">
        <Hero />
        <BarField />
        <About />
        <Events />
        <Gallery />
        <WorkedAt />
      </main>

      <Footer />
      <Motion />
    </>
  );
}
