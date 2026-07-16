import type { Metadata } from "next";
import { Wrench, Filter, Settings, HardHat, Hammer, Headset, Siren, LucideIcon } from "lucide-react";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Services",
  description: "Installation, maintenance, repairs and technical support for compressed air systems.",
};

const iconMap: Record<string, LucideIcon> = {
  wrench: Wrench,
  filter: Filter,
  settings: Settings,
  hardhat: HardHat,
  hammer: Hammer,
  headset: Headset,
  siren: Siren,
};

const fallbackServices = [
  { id: "1", title: "Industrial Air Solutions", slug: "industrial-air-solutions", description: "End-to-end compressed air system design for industrial facilities.", icon: "wrench" },
  { id: "2", title: "Filter Replacement", slug: "filter-replacement", description: "Scheduled replacement programs to keep filtration running at peak efficiency.", icon: "filter" },
  { id: "3", title: "Compressor Maintenance", slug: "compressor-maintenance", description: "Preventive maintenance plans that reduce downtime and extend equipment life.", icon: "settings" },
  { id: "4", title: "Installation", slug: "installation", description: "Professional installation of compressors and filtration systems.", icon: "hardhat" },
  { id: "5", title: "Repairs", slug: "repairs", description: "Fast, certified repairs to get your equipment back online.", icon: "hammer" },
  { id: "6", title: "Technical Consultation", slug: "technical-consultation", description: "Expert guidance to help you specify the right equipment.", icon: "headset" },
  { id: "7", title: "Emergency Support", slug: "emergency-support", description: "24/7 emergency response for critical compressed air failures.", icon: "siren" },
];

async function getServices() {
  try {
    const services = await prisma.service.findMany({ orderBy: { order: "asc" } });
    return services.length ? services : fallbackServices;
  } catch {
    return fallbackServices;
  }
}

export default async function ServicesPage() {
  const services = await getServices();

  return (
    <>
      <section className="bg-brand-dark py-16 text-center text-white">
        <Container>
          <h1 className="font-heading text-4xl font-bold">Our Services</h1>
          <p className="mt-3 text-gray-300">Full lifecycle support for your compressed air systems.</p>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {services.map((s) => {
              const Icon = iconMap[s.icon] ?? Wrench;
              return (
                <div
                  key={s.id}
                  className="rounded-card border border-brand-border p-8 transition-all hover:-translate-y-1 hover:shadow-lg"
                >
                  <Icon className="text-brand-red" size={32} />
                  <h3 className="mt-4 font-heading text-lg font-bold">{s.title}</h3>
                  <p className="mt-2 text-sm text-brand-text/70">{s.description}</p>
                </div>
              );
            })}
          </div>
        </Container>
      </section>

      <section className="bg-brand-red py-16 text-center text-white">
        <Container>
          <h2 className="font-heading text-3xl font-bold">Need a service technician on site?</h2>
          <p className="mt-3 text-white/90">Tell us what you need and our team will respond within one business day.</p>
          <Button href="/contact" variant="dark" className="mt-6">
            Request Service
          </Button>
        </Container>
      </section>
    </>
  );
}
