import dynamic from "next/dynamic";
import Navbar from "@/components/Navbar";
import SmoothScroll from "@/components/SmoothScroll";
import Hero from "@/components/Hero";
import ContentWrapper from "@/components/ContentWrapper";
import LazySection from "@/components/LazySection";

const Filter       = dynamic(() => import("@/components/Filter"),       { ssr: false });
const Capabilities = dynamic(() => import("@/components/Capabilities"), { ssr: false });
const Process      = dynamic(() => import("@/components/Process"),      { ssr: false });
const CTA          = dynamic(() => import("@/components/CTA"),          { ssr: false });
const Footer       = dynamic(() => import("@/components/Footer"),       { ssr: false });

export default function Home() {
  return (
    <main style={{ background: "#0D0D0D" }}>
      <div style={{ position: "sticky", top: 0, zIndex: 0, height: "100vh" }}>
        <Hero />
      </div>
      <div style={{ position: "relative", zIndex: 1 }}>
        <ContentWrapper>
          <Filter />
        </ContentWrapper>
        <div style={{ marginTop: "-100vh" }}>
          <Capabilities />
        </div>
        <LazySection rootMargin="600px">
          <Process />
        </LazySection>
        <CTA />
        <Footer />
      </div>
      <Navbar />
      <SmoothScroll />
    </main>
  );
}
