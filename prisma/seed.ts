import { PrismaClient } from "@prisma/client";
import bcrypt from "bcrypt";

const prisma = new PrismaClient();

async function main() {
  const adminEmail = process.env.ADMIN_EMAIL || "admin@koeb.com";
  const adminPassword = process.env.ADMIN_PASSWORD || "change-me";
  const hashed = await bcrypt.hash(adminPassword, 10);

await prisma.user.upsert({
  where: { email: adminEmail },
  update: {
    password: hashed,
  },
  create: {
    name: "KOEB Admin",
    email: adminEmail,
    password: hashed,
  },
});

  await prisma.settings.upsert({
    where: { id: "settings" },
    update: {},
    create: { id: "settings" },
  });

  await prisma.homepage.upsert({
    where: { id: "homepage" },
    update: {},
    create: {
      id: "homepage",
      featureCards: [
        { icon: "shield", title: "High Quality", description: "Premium materials and strict quality control." },
        { icon: "gauge", title: "Reliable Performance", description: "Engineered for maximum efficiency and durability." },
        { icon: "headset", title: "Expert Support", description: "Professional support and after-sales service." },
        { icon: "award", title: "Trusted Solutions", description: "Trusted by industries worldwide." },
      ],
    },
  });

  const filters = await prisma.category.upsert({
    where: { slug: "air-filters" },
    update: {},
    create: { name: "Air Filters", slug: "air-filters", order: 1 },
  });
  const compressors = await prisma.category.upsert({
    where: { slug: "air-compressors" },
    update: {},
    create: { name: "Air Compressors", slug: "air-compressors", order: 2 },
  });
  await prisma.category.upsert({
    where: { slug: "compressor-parts" },
    update: {},
    create: { name: "Compressor Parts", slug: "compressor-parts", order: 3 },
  });
  await prisma.category.upsert({
    where: { slug: "accessories" },
    update: {},
    create: { name: "Accessories", slug: "accessories", order: 4 },
  });

  await prisma.product.upsert({
    where: { slug: "koeb-industrial-air-filter-if-200" },
    update: {},
    create: {
      name: "KOEB Industrial Air Filter IF-200",
      slug: "koeb-industrial-air-filter-if-200",
      categoryId: filters.id,
      description:
        "Heavy duty pleated air filter designed for continuous industrial operation, engineered for high dust-holding capacity and low pressure drop.",
      specifications: { "Filtration Efficiency": "99.9%", Material: "Cellulose / Synthetic blend", "Max Temp": "80°C" },
      applications: ["Manufacturing plants", "Compressor intake filtration", "HVAC systems"],
      features: ["High dust holding capacity", "Corrosion resistant housing", "Long service life"],
      featured: true,
    },
  });

  await prisma.product.upsert({
    where: { slug: "koeb-screw-compressor-sc-75" },
    update: {},
    create: {
      name: "KOEB Screw Compressor SC-75",
      slug: "koeb-screw-compressor-sc-75",
      categoryId: compressors.id,
      description:
        "75 HP rotary screw air compressor built for demanding industrial environments, offering consistent airflow and energy-efficient operation.",
      specifications: { Power: "75 HP", "Max Pressure": "10 bar", "Air Delivery": "12.5 m³/min" },
      applications: ["Automotive workshops", "Manufacturing lines", "Textile mills"],
      features: ["Energy efficient motor", "Low noise enclosure", "Digital control panel"],
      featured: true,
    },
  });

  await prisma.partner.upsert({
    where: { id: "atlas-copco" },
    update: {},
    create: { id: "atlas-copco", name: "Atlas Copco", logoUrl: "/images/partners/atlas-copco.png", order: 1 },
  });
  await prisma.partner.upsert({
    where: { id: "mann-hummel" },
    update: {},
    create: { id: "mann-hummel", name: "Mann+Hummel", logoUrl: "/images/partners/mann-hummel.png", order: 2 },
  });
  await prisma.partner.upsert({
    where: { id: "donaldson" },
    update: {},
    create: { id: "donaldson", name: "Donaldson", logoUrl: "/images/partners/donaldson.png", order: 3 },
  });
  await prisma.partner.upsert({
    where: { id: "kaeser" },
    update: {},
    create: { id: "kaeser", name: "Kaeser Compressors", logoUrl: "/images/partners/kaeser.png", order: 4 },
  });

  const services = [
    { title: "Industrial Air Solutions", slug: "industrial-air-solutions", description: "End-to-end compressed air system design for industrial facilities." },
    { title: "Filter Replacement", slug: "filter-replacement", description: "Scheduled replacement programs to keep your filtration running at peak efficiency." },
    { title: "Compressor Maintenance", slug: "compressor-maintenance", description: "Preventive maintenance plans that reduce downtime and extend equipment life." },
    { title: "Installation", slug: "installation", description: "Professional installation of compressors and filtration systems." },
    { title: "Repairs", slug: "repairs", description: "Fast, certified repairs to get your equipment back online." },
    { title: "Technical Consultation", slug: "technical-consultation", description: "Expert guidance to help you specify the right equipment for your application." },
    { title: "Emergency Support", slug: "emergency-support", description: "24/7 emergency response for critical compressed air failures." },
  ];
  for (const [i, s] of services.entries()) {
    await prisma.service.upsert({
      where: { slug: s.slug },
      update: {},
      create: { ...s, order: i + 1 },
    });
  }

  console.log("Seed complete. Admin login:", adminEmail);
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
