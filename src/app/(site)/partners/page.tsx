import type { Metadata } from "next";
import Image from "next/image";
import { prisma } from "@/lib/prisma";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Button from "@/components/ui/Button";

export const metadata: Metadata = {
  title: "Partners",
  description: "KOEB partners with leading global manufacturers of filtration and compression equipment.",
};

const fallbackPartners = [
  { id: "atlas-copco", name: "Atlas Copco", logoUrl: "/images/partners/atlas-copco.svg", description: "Global leader in compressed air and industrial equipment." },
  { id: "mann-hummel", name: "Mann+Hummel", logoUrl: "/images/partners/mann-hummel.svg", description: "Precision filtration technology for demanding applications." },
  { id: "donaldson", name: "Donaldson", logoUrl: "/images/partners/donaldson.svg", description: "Filtration solutions trusted across heavy industry." },
  { id: "kaeser", name: "Kaeser Compressors", logoUrl: "/images/partners/kaeser.svg", description: "Engineering excellence in industrial air compressors." },
];

async function getPartners() {
  try {
    const partners = await prisma.partner.findMany({ orderBy: { order: "asc" } });
    return partners.length ? partners : fallbackPartners;
  } catch {
    return fallbackPartners;
  }
}

export default async function PartnersPage() {
  const partners = await getPartners();

  return (
    <>
      <section className="bg-brand-dark py-16 text-center text-white">
        <Container>
          <h1 className="font-heading text-4xl font-bold">Our Partners</h1>
          <p className="mt-3 text-gray-300">Working with the world's leading filtration and compression brands.</p>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <SectionHeading title="Trusted By Industry Leaders" />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2">
            {partners.map((p) => (
              <div key={p.id} className="flex items-center gap-6 rounded-card border border-brand-border p-6">
                <div className="relative h-16 w-32 shrink-0">
                  <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
                </div>
                <div>
                  <h3 className="font-heading font-bold">{p.name}</h3>
                  <p className="mt-1 text-sm text-brand-text/70">{p.description}</p>
                </div>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-red py-16 text-center text-white">
        <Container>
          <h2 className="font-heading text-3xl font-bold">Become a Partner</h2>
          <p className="mt-3 text-white/90">
            Distribute or collaborate with KOEB across your region. Let's talk.
          </p>
          <Button href="/contact" variant="dark" className="mt-6">
            Become a Partner
          </Button>
        </Container>
      </section>
    </>
  );
}
