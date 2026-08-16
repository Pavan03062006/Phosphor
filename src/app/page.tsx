import { AccessSection } from "@/components/home/AccessSection";
import { HowItWorks } from "@/components/home/HowItWorks";
import { LiveNetworkPulse } from "@/components/home/LiveNetworkPulse";
import { ProductModules } from "@/components/home/ProductModules";
import { PhosphorHero } from "@/components/hero/PhosphorHero";
import { Footer } from "@/components/layout/Footer";

export default function Home() {
  return (
    <main className="flex flex-1 flex-col">
      <PhosphorHero />
      <ProductModules />
      <HowItWorks />
      <LiveNetworkPulse />
      <AccessSection />
      <Footer />
    </main>
  );
}
