"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Plus, Pencil, Trash2 } from "lucide-react";

type Product = {
  id: string;
  name: string;
  slug: string;
  featured: boolean;
  category: { name: string };
  images: { url: string }[];
};

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const load = async () => {
    setLoading(true);
    const res = await fetch("/api/products");
    setProducts(res.ok ? await res.json() : []);
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const remove = async (id: string) => {
    if (!confirm("Delete this product? This also removes its images from Cloudinary.")) return;
    await fetch(`/api/products/${id}`, { method: "DELETE" });
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Products</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-button bg-brand-red px-4 py-2.5 text-sm font-heading font-semibold text-white"
        >
          <Plus size={16} /> New Product
        </Link>
      </div>

      <div className="mt-6 overflow-x-auto rounded-card bg-white shadow-sm">
        {loading ? (
          <p className="p-6 text-sm text-brand-text/60">Loading...</p>
        ) : products.length === 0 ? (
          <p className="p-6 text-sm text-brand-text/60">
            No products yet — connect your database (see .env.example) and add your first product.
          </p>
        ) : (
          <table className="w-full min-w-[560px] text-sm">
            <thead className="bg-brand-light text-left text-xs uppercase text-brand-text/60">
              <tr>
                <th className="px-5 py-3">Image</th>
                <th className="px-5 py-3">Name</th>
                <th className="px-5 py-3">Category</th>
                <th className="px-5 py-3">Featured</th>
                <th className="px-5 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id} className="border-t border-brand-border">
                  <td className="px-5 py-3">
                    <div className="relative h-12 w-12 rounded-button bg-brand-light overflow-hidden">
                      {p.images[0] && (
                        <Image src={p.images[0].url} alt="" fill className="object-contain p-1" />
                      )}
                    </div>
                  </td>
                  <td className="px-5 py-3 font-medium">{p.name}</td>
                  <td className="px-5 py-3 text-brand-text/70">{p.category.name}</td>
                  <td className="px-5 py-3">{p.featured ? "Yes" : "No"}</td>
                  <td className="px-5 py-3">
                    <div className="flex justify-end gap-3">
                      <Link href={`/admin/products/${p.id}/edit`} className="text-brand-text/60 hover:text-brand-red">
                        <Pencil size={16} />
                      </Link>
                      <button onClick={() => remove(p.id)} className="text-brand-text/60 hover:text-red-600">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
