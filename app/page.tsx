import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import Filter from "@/components/Filter";
import Capabilities from "@/components/Capabilities";
import Process from "@/components/Process";
import Differentiator from "@/components/Differentiator";
import CTA from "@/components/CTA";
import Footer from "@/components/Footer";
import ContentWrapper from "@/components/ContentWrapper";
export default function Home() {
  return (
    <main style={{ background: "#0D0D0D" }}>
      {/* Hero sticky — las secciones siguientes se superponen al hacer scroll */}
      <div style={{ position: "sticky", top: 0, zIndex: 0, height: "100vh" }}>
        <Hero />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <ContentWrapper>
          <Filter />
        </ContentWrapper>
        <Capabilities />
        <Process />
        <Differentiator />
        <CTA />
        <Footer />
      </div>
      <Navbar />
      <SmoothScroll />
    </main>
  );
}
