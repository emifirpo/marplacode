import dynamic from "next/dynamic";

const Navbar = dynamic(() => import("@/components/Navbar"), { ssr: false });
const Hero = dynamic(() => import("@/components/Hero"), { ssr: false });
const Filter = dynamic(() => import("@/components/Filter"), { ssr: false });
const Capabilities = dynamic(() => import("@/components/Capabilities"), { ssr: false });
const Cases = dynamic(() => import("@/components/Cases"), { ssr: false });
const Process = dynamic(() => import("@/components/Process"), { ssr: false });
const Differentiator = dynamic(() => import("@/components/Differentiator"), { ssr: false });
const CTA = dynamic(() => import("@/components/CTA"), { ssr: false });
const Footer = dynamic(() => import("@/components/Footer"), { ssr: false });
const ShrinkOnScroll = dynamic(() => import("@/components/ShrinkOnScroll"), { ssr: false });

export default function Home() {
  return (
    <main style={{ background: "#0D0D0D" }}>
      {/* Hero sticky — las secciones siguientes se superponen al hacer scroll */}
      <div style={{ position: 'sticky', top: 0, zIndex: 0, height: '100vh' }}>
        <Hero />
      </div>

      {/* Solo el container blanco (Filter) recibe el efecto de achique + border-radius */}
      <div style={{ position: 'relative', zIndex: 1 }}>
        <ShrinkOnScroll>
          <Filter />
        </ShrinkOnScroll>

        {/* Capabilities: horizontal gallery with built-in dissolve reveal */}
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
