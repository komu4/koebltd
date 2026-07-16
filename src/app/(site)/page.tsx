import { prisma } from "@/lib/prisma";
import Hero from "@/components/home/Hero";
import FeatureStrip, { FeatureCard } from "@/components/home/FeatureStrip";
import About from "@/components/home/About";
import ProductsShowcase from "@/components/home/ProductsShowcase";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import Partners from "@/components/home/Partners";

const defaultFeatures: FeatureCard[] = [
  { icon: "shield", title: "High Quality", description: "Premium materials and strict quality control." },
  { icon: "gauge", title: "Reliable Performance", description: "Engineered for maximum efficiency and durability." },
  { icon: "headset", title: "Expert Support", description: "Professional support and after-sales service." },
  { icon: "award", title: "Trusted Solutions", description: "Trusted by industries worldwide." },
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
        titleLine1={homepage?.heroTitleLine1 || "Pure Air."}
        titleLine2={homepage?.heroTitleLine2 || "Powerful Performance."}
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
          "KOEB is a trusted supplier of high quality air filters and air compressors for industrial, commercial and automotive applications. We are committed to delivering products that ensure clean air, optimal performance and long lasting reliability.\nOur mission is to power your productivity with innovative solutions and unmatched service."
        }
        imageUrl={homepage?.aboutImageUrl}
      />
      <ProductsShowcase />
      <FeaturedProducts />
      <Partners partners={partnerList} />
    </>
  );
}
