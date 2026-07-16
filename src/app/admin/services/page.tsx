"use client";

import { useEffect, useState } from "react";
import { Plus, Trash2, Pencil } from "lucide-react";
import Button from "@/components/ui/Button";

type Service = { id: string; title: string; slug: string; description: string; icon: string };

const icons = ["wrench", "filter", "settings", "hardhat", "hammer", "headset", "siren"];

export default function AdminServicesPage() {
  const [services, setServices] = useState<Service[]>([]);
  const [editing, setEditing] = useState<Service | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", slug: "", description: "", icon: "wrench" });

  const load = () => fetch("/api/services").then((r) => r.json()).then(setServices);

  useEffect(() => {
    load();
  }, []);

  const startEdit = (s?: Service) => {
    setEditing(s || null);
    setForm(s ? { title: s.title, slug: s.slug, description: s.description, icon: s.icon } : { title: "", slug: "", description: "", icon: "wrench" });
    setShowForm(true);
  };

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    const method = editing ? "PUT" : "POST";
    await fetch("/api/services", {
      method,
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(editing ? { id: editing.id, ...form } : form),
    });
    setShowForm(false);
    load();
  };

  const remove = async (id: string) => {
    if (!confirm("Delete this service?")) return;
    await fetch("/api/services", {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ id }),
    });
    load();
  };

  return (
    <div>
      <div className="flex flex-wrap items-center justify-between gap-3">
        <h1 className="font-heading text-2xl font-bold">Services</h1>
        <button
          onClick={() => startEdit()}
          className="flex items-center gap-2 rounded-button bg-brand-red px-4 py-2.5 text-sm font-heading font-semibold text-white"
        >
          <Plus size={16} /> New Service
        </button>
      </div>

      {showForm && (
        <form onSubmit={save} className="mt-6 max-w-md space-y-4 rounded-card bg-white p-6 shadow-sm">
          <input
            required
            placeholder="Title"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <input
            required
            placeholder="slug-in-lowercase"
            value={form.slug}
            onChange={(e) => setForm({ ...form, slug: e.target.value })}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <textarea
            required
            rows={3}
            placeholder="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          />
          <select
            value={form.icon}
            onChange={(e) => setForm({ ...form, icon: e.target.value })}
            className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
          >
            {icons.map((i) => (
              <option key={i} value={i}>{i}</option>
            ))}
          </select>
          <div className="flex gap-3">
            <Button type="submit">Save</Button>
            <button type="button" onClick={() => setShowForm(false)} className="text-sm text-brand-text/60">
              Cancel
            </button>
          </div>
        </form>
      )}

      <div className="mt-6 space-y-3">
        {services.map((s) => (
          <div key={s.id} className="flex flex-wrap items-center justify-between gap-3 rounded-card bg-white p-5 shadow-sm">
            <div className="min-w-0">
              <p className="font-heading font-semibold">{s.title}</p>
              <p className="text-sm text-brand-text/60">{s.description}</p>
            </div>
            <div className="flex shrink-0 gap-3">
              <button onClick={() => startEdit(s)} className="text-brand-text/60 hover:text-brand-red">
                <Pencil size={16} />
              </button>
              <button onClick={() => remove(s.id)} className="text-brand-text/60 hover:text-red-600">
                <Trash2 size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
