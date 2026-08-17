import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import FeatureStrip, { FeatureCard } from "@/components/home/FeatureStrip";
import About from "@/components/home/About";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Partners from "@/components/home/Partners";

const defaultFeatures: FeatureCard[] = [
  { icon: "gauge", title: "Quick Response", description: "Fast support when your equipment needs attention" },
  { icon: "award", title: "Professionalism", description: "Expert service you can trust every time." },
  { icon: "package", title: "Supply", description: "Quality spare parts for lasting performance" },
  { icon: "shield", title: "Trusted Solutions", description: "Reliable service wherever your business operates." },
];

async function getHomepageData() {
  try {
    const [homepage, partners] = await Promise.all([
      prisma.homepage.findUnique({ where: { id: "homepage" } }),
      prisma.partner.findMany({ orderBy: { order: "asc" } }),
    ]);
    return { homepage, partners };
  } catch {
    // DB not connected yet (e.g. running without DATABASE_URL configured) — fall back to defaults
    return { homepage: null, partners: [] };
  }
}

export default async function HomePage() {
  const { homepage, partners } = await getHomepageData();

  const features = (homepage?.featureCards as unknown as FeatureCard[]) || defaultFeatures;
  const partnerList =
    partners.length > 0
      ? partners.map((p) => ({ id: p.id, name: p.name, logoUrl: p.logoUrl }))
      : [
          { id: "atlas-copco", name: "Atlas Copco", logoUrl: "/images/partners/atlas-copco.svg" },
          { id: "mann-hummel", name: "Mann+Hummel", logoUrl: "/images/partners/mann-hummel.svg" },
          { id: "donaldson", name: "Donaldson", logoUrl: "/images/partners/donaldson.svg" },
          { id: "kaeser", name: "Kaeser Compressors", logoUrl: "/images/partners/kaeser.svg" },
        ];

  return (
    <>
      <Hero
        titleLine1={homepage?.heroTitleLine1 || "Equipment."}
        titleLine2={homepage?.heroTitleLine2 || "spare parts. services"}
        subtitle={
          homepage?.heroSubtitle ||
          "High quality air filters and air compressors built for reliability and efficiency."
        }
        primaryLabel={homepage?.heroPrimaryLabel || "View Products"}
        primaryHref={homepage?.heroPrimaryHref || "/products"}
        secondaryLabel={homepage?.heroSecondaryLabel || "Our Services"}
        secondaryHref={homepage?.heroSecondaryHref || "/services"}
        backgroundImageUrl={homepage?.heroImageUrl}
      />
      <FeatureStrip features={features} />
      <About
        heading={homepage?.aboutHeading || "About Us"}
        body={
          homepage?.aboutBody ||
          "KOEB Industrial Solutions Ltd is a trusted provider of industrial air solutions, specializing in air compressor servicing, air dryer maintenance, spare parts supply, air audits, air-end overhauls, and variable speed drive (VSD) solutions. Founded by seasoned professionals with over two decades of combined experience in the air compressor and industrial machinery industry, KOEB has built a reputation for delivering reliable, efficient, and cost-effective solutions to businesses across Nigeria At KOEB, we understand the critical role compressed air systems play in industrial operations. Our team of highly skilled engineers and technicians is committed to ensuring optimal equipment performance, minimizing downtime, and maximizing productivity through prompt response, technical expertise, and professional service delivery. We pride ourselves on providing genuine spare parts, comprehensive maintenance support, and customized service level agreements tailored to the unique needs of our clients. Our core values of trust, loyalty, and long-term partnership guide every project we undertake and every relationship we build. With a nationwide reach and a customer-focused approach, KOEB Industrial Solutions Ltd remains dedicated to helping industries achieve operational excellence through dependable compressed air solutions. KOEB Industrial Solutions Ltd – Your Trusted Partner for Reliable Industrial Air Solutions. "
        }
        imageUrl={homepage?.aboutImageUrl}
      />
      <ProductsShowcase
        heading={homepage?.ourProductsHeading}
        cards={(homepage?.ourProductsCards as Parameters<typeof ProductsShowcase>[0]["cards"]) ?? undefined}
      />
      <FeaturedProducts />
      <Partners partners={partnerList} />
    </>
  );
}
