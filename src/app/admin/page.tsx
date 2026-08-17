import Link from "next/link";
import { Package, FolderTree, Handshake, Wrench } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getCounts() {
  try {
    const [products, categories, services, partners] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.service.count(),
      prisma.partner.count(),
    ]);
    return { products, categories, services, partners };
  } catch {
    return { products: 0, categories: 0, services: 0, partners: 0 };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: "Products", value: counts.products, icon: Package, href: "/admin/products" },
    { label: "Our Products", value: counts.categories, icon: FolderTree, href: "/admin/categories" },
    { label: "Services", value: counts.services, icon: Wrench, href: "/admin/services" },
    { label: "Partners", value: counts.partners, icon: Handshake, href: "/admin/partners" },
  ];

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold text-brand-text">Dashboard</h1>
      <p className="mt-1 text-sm text-brand-text/60">Overview of your KOEB website content.</p>

      <div className="mt-8 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {cards.map((c) => (
          <Link
            key={c.label}
            href={c.href}
            className="rounded-card bg-white p-6 shadow-sm transition hover:shadow-md"
          >
            <c.icon className="text-brand-red" size={26} />
            <p className="mt-4 font-heading text-3xl font-bold">{c.value}</p>
            <p className="mt-1 text-sm text-brand-text/60">{c.label}</p>
          </Link>
        ))}
      </div>

      <div className="mt-10 rounded-card bg-white p-6 shadow-sm">
        <h2 className="font-heading font-semibold">Getting started</h2>
        <ol className="mt-3 list-decimal space-y-1 pl-5 text-sm text-brand-text/70">
          <li>Login to the admin panel</li>
          <li>Insert images and descriptions for your products and services</li>
          <li>Contact inquiries are sent directly to <strong>info@koebltd.com</strong></li>
        </ol>
      </div>
    </div>
  );
}
