import type { Metadata } from "next";
import Image from "next/image";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { ShieldCheck, Target, Eye, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "About Us",
  description: "Learn about KOEB's story, mission, vision and commitment to industrial air quality.",
};

const values = [
  { icon: ShieldCheck, title: "Quality First", text: "Every product is tested against strict industrial standards." },
  { icon: Target, title: "Reliability", text: "Built for continuous operation in demanding environments." },
  { icon: Eye, title: "Transparency", text: "Clear specifications, honest advice, no shortcuts." },
  { icon: Users, title: "Customer Focus", text: "Support that goes beyond the sale." },
];

const timeline = [
  { year: "2018", text: "KOEB founded to supply filtration solutions to Lagos manufacturers." },
  { year: "2020", text: "Expanded into industrial air compressors and compressor parts." },
  { year: "2022", text: "Opened our current head office and regional distribution center." },
  { year: "2024", text: "Serving industrial, commercial and automotive clients across West Africa." },
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-brand-dark py-16 text-center text-white">
        <Container>
          <h1 className="font-heading text-4xl font-bold">About KOEB</h1>
          <p className="mt-3 text-gray-300">Powering clean air and reliable performance.</p>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-2 lg:items-center">
          <div>
            <SectionHeading title="Our Story" align="left" />
            <p className="mt-5 leading-relaxed text-brand-text/80">
              KOEB started as a small filtration supplier serving local manufacturers and has
              grown into a trusted partner for air filters, air compressors, compressor parts and
              industrial accessories across the region. We work with plant managers and
              maintenance teams who need equipment that simply doesn't fail.
            </p>
            <p className="mt-4 leading-relaxed text-brand-text/80">
              Today our catalog spans engine filtration, industrial dust and process filters,
              piston and screw compressors, and the accessories that keep them running.
            </p>
          </div>
          <div className="relative h-80 overflow-hidden rounded-section">
            <Image src="/images/about-building.svg" alt="KOEB headquarters" fill className="object-cover" />
          </div>
        </Container>
      </section>

      <section className="bg-brand-light py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container className="grid grid-cols-1 gap-10 md:grid-cols-2">
          <div className="rounded-card bg-white p-8 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-brand-red">Our Mission</h3>
            <p className="mt-3 text-brand-text/80">
              To power industrial productivity by delivering air filtration and compression
              equipment that customers can depend on, backed by expert service.
            </p>
          </div>
          <div className="rounded-card bg-white p-8 shadow-sm">
            <h3 className="font-heading text-xl font-bold text-brand-red">Our Vision</h3>
            <p className="mt-3 text-brand-text/80">
              To be the region's most trusted name in industrial air solutions, known for
              quality, reliability and long-term partnership.
            </p>
          </div>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <SectionHeading title="Why Choose KOEB" />
          <div className="mt-12 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {values.map((v) => (
              <div key={v.title} className="rounded-card border border-brand-border p-6 text-center">
                <v.icon className="mx-auto text-brand-red" size={32} />
                <h4 className="mt-4 font-heading font-semibold">{v.title}</h4>
                <p className="mt-2 text-sm text-brand-text/70">{v.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="bg-brand-light py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <SectionHeading title="Our Journey" />
          <div className="mt-12 mx-auto max-w-2xl space-y-8">
            {timeline.map((t) => (
              <div key={t.year} className="flex gap-6">
                <div className="font-heading text-xl font-bold text-brand-red w-16 shrink-0">{t.year}</div>
                <p className="text-brand-text/80">{t.text}</p>
              </div>
            ))}
          </div>
        </Container>
      </section>

      <section className="py-section-mobile md:py-section-tablet lg:py-section-desktop">
        <Container>
          <SectionHeading title="Gallery" />
          <div className="mt-12 grid grid-cols-2 gap-4 md:grid-cols-4">
            {[1, 2, 3, 4].map((n) => (
              <div key={n} className="relative h-40 overflow-hidden rounded-button bg-brand-light">
                <Image src="/images/products/product-gallery-1.svg" alt="KOEB facility" fill className="object-cover" />
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
