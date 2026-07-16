"use client";

import { useEffect, useState } from "react";
import Image from "next/image";
import { Plus, Trash2, Pencil } from "lucide-react";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import Button from "@/components/ui/Button";

type Partner = {
  id: string;
  name: string;
  logoUrl: string;
  logoPublicId?: string | null;
  website?: string | null;
  description?: string | null;
  order: number;
};

export default function AdminPartnersPage() {
  const [partners, setPartners] = useState<Partner[]>([]);
  const [editing, setEditing] = useState<Partner | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [name, setName] = useState("");
  const [website, setWebsite] = useState("");
  const [description, setDescription] = useState("");
  const [order, setOrder] = useState(0);
  const [logo, setLogo] = useState<UploadedImage[]>([]);

  const load = () => fetch("/api/partners").then((r) => r.json()).then(setPartners);

  useEffect(() => {
    load();
  }, []);

  const startEdit = (p?: Partner) => {
    setEditing(p || null);
    setName(p?.name || "");
    setWebsite(p?.website || "");
    setDescription(p?.description || "");
    setOrder(p?.order || 0);
    setLogo(p ? [{ url: p.logoUrl, publicId: p.logoPublicId || "" }] : []);
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const payload = {
      name,
      website,
      description,
      order,
      logoUrl: logo[0]?.url,
      logoPublicId: logo[0]?.publicId,
    };
    const method = editing ? "PUT" : "POST";
    await fetch("/api/partners", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...payload } : payload),
    });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this partner?")) return;
    await fetch("/api/partners", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Partners</h1>
        <button
          onClick={() => startEdit()}
          className="flex items-center gap-2 rounded-button bg-brand-red px-4 py-2.5 text-sm font-heading font-semibold text-white"
        >
          <Plus size={16} /> New Partner
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="mt-6 max-w-md space-y-4 rounded-card bg-white p-6 shadow-sm">
          <input
            required
            placeholder="Partner name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <input
            placeholder="Website (optional)"
            value={website}
            onChange={(e) => setWebsite(e.target.value)}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <textarea
            placeholder="Description (optional)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <input
            type="number"
            placeholder="Display order"
            value={order}
            onChange={(e) => setOrder(Number(e.target.value))}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <ImageUploader value={logo} onChange={setLogo} folder="partners" />
          <div className="flex gap-3">
            <Button type="submit">Save</Button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-brand-text/60">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-2">
        {partners.map((p) => (
          <div key={p.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-5 shadow-sm">
            <div className="flex min-w-0 items-center gap-4">
              <div className="relative h-10 w-20 shrink-0">
                <Image src={p.logoUrl} alt={p.name} fill className="object-contain" />
              </div>
              <p className="truncate font-heading font-semibold">{p.name}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button onClick={() => startEdit(p)} className="text-brand-text/60 hover:text-brand-red">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(p.id)} className="text-brand-text/60 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
