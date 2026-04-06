import Navbar from "@/components/Navbar";
import Hero from "@/components/Hero";
import Filter from "@/components/Filter";
import Capabilities from "@/components/Capabilities";
import Cases from "@/components/Cases";
import Process from "@/components/Process";
import Differentiator from "@/components/Differentiator";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main style={{ background: "#0D0D0D" }}>
      {/* Hero sticky — las secciones siguientes se superponen al hacer scroll */}
      <div style={{ position: "sticky", top: 0, zIndex: 0, height: "100vh" }}>
        <Hero />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <Filter />
        <Capabilities />
        <Cases />
        <Process />
        <Differentiator />
        <CTA />
        <Footer />
      </div>
      <Navbar />
    </main>
  );
}
