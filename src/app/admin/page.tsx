import Link from "next/link";
import { Package, FolderTree, Mail, Handshake } from "lucide-react";
import { prisma } from "@/lib/prisma";

async function getCounts() {
  try {
    const [products, categories, messages, partners] = await Promise.all([
      prisma.product.count(),
      prisma.category.count(),
      prisma.contactMessage.count({ where: { read: false } }),
      prisma.partner.count(),
    ]);
    return { products, categories, messages, partners };
  } catch {
    return { products: 0, categories: 0, messages: 0, partners: 0 };
  }
}

export default async function AdminDashboard() {
  const counts = await getCounts();

  const cards = [
    { label: "Products", value: counts.products, icon: Package, href: "/admin/products" },
    { label: "Categories", value: counts.categories, icon: FolderTree, href: "/admin/categories" },
    { label: "Unread Messages", value: counts.messages, icon: Mail, href: "/admin/messages" },
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
          <li>login</li>
          <li>insert images and description</li>
          
        </ol>
      </div>
    </div>
  );
}
