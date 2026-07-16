"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";

type Category = { id: string; name: string; slug: string; order: number };

export default function AdminCategoriesPage() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [editing, setEditing] = useState<Category | null>(null);
  const [name, setName] = useState("");
  const [slug, setSlug] = useState("");
  const [showForm, setShowForm] = useState(false);

  const load = () => fetch("/api/categories").then((r) => r.json()).then(setCategories);

  useEffect(() => {
    load();
  }, []);

  const startEdit = (c?: Category) => {
    setEditing(c || null);
    setName(c?.name || "");
    setSlug(c?.slug || "");
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/categories", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, name, slug } : { name, slug }),
    });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this category?")) return;
    await fetch("/api/categories", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Categories</h1>
        <button
          onClick={() => startEdit()}
          className="flex items-center gap-2 rounded-button bg-brand-red px-4 py-2.5 text-sm font-heading font-semibold text-white"
        >
          <Plus size={16} /> New Category
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="mt-6 max-w-md space-y-4 rounded-card bg-white p-6 shadow-sm">
          <input
            required
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <input
            required
            placeholder="slug-in-lowercase"
            value={slug}
            onChange={(e) => setSlug(e.target.value)}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <div className="flex gap-3">
            <Button type="submit">Save</Button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-brand-text/60">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 overflow-x-auto rounded-card bg-white shadow-sm">
        <table className="w-full min-w-[420px] text-sm">
          <thead className="bg-brand-light text-left text-xs uppercase text-brand-text/60">
            <tr>
              <th className="px-5 py-3">Name</th>
              <th className="px-5 py-3">Slug</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {categories.map((c) => (
              <tr key={c.id} className="border-t border-brand-border">
                <td className="px-5 py-3 font-medium">{c.name}</td>
                <td className="px-5 py-3 text-brand-text/60">{c.slug}</td>
                <td className="px-5 py-3">
                  <div className="flex justify-end gap-3">
                    <button onClick={() => startEdit(c)} className="text-brand-text/60 hover:text-brand-red">
                      <Pencil size={16} />
                    </button>
                    <button onClick={() => remove(c.id)} className="text-brand-text/60 hover:text-red-600">
                      <Trash2 size={16} />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
