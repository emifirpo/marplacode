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
    <main>
      <Hero />
      <Filter />
      <Capabilities />
      <Cases />
      <Process />
      <Differentiator />
      <CTA />
      <Footer />
      <Navbar />
    </main>
  );
}
