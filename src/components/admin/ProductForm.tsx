"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import Button from "@/components/ui/Button";

type Category = { id: string; name: string };

type ProductFormValue = {
  id?: string;
  name: string;
  slug: string;
  categoryId: string;
  description: string;
  specifications: Record<string, string>;
  applications: string[];
  features: string[];
  featured: boolean;
  images: UploadedImage[];
};

const emptyProduct: ProductFormValue = {
  name: "",
  slug: "",
  categoryId: "",
  description: "",
  specifications: {},
  applications: [],
  features: [],
  featured: false,
  images: [],
};

export default function ProductForm({ initial }: { initial?: Partial<ProductFormValue> }) {
  const router = useRouter();
  const [categories, setCategories] = useState<Category[]>([]);
  const [form, setForm] = useState<ProductFormValue>({ ...emptyProduct, ...initial });
  const [specRows, setSpecRows] = useState(
    Object.entries(form.specifications || {}).length
      ? Object.entries(form.specifications || {})
      : [["", ""]]
  );
  const [applicationsText, setApplicationsText] = useState((form.applications || []).join(", "));
  const [featuresText, setFeaturesText] = useState((form.features || []).join(", "));
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/categories")
      .then((r) => r.json())
      .then(setCategories)
      .catch(() => setCategories([]));
  }, []);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setError("");

    const specifications = Object.fromEntries(specRows.filter(([k]) => k.trim() !== ""));
    const payload = {
      name: form.name,
      slug: form.slug,
      categoryId: form.categoryId,
      description: form.description,
      specifications,
      applications: applicationsText.split(",").map((s) => s.trim()).filter(Boolean),
      features: featuresText.split(",").map((s) => s.trim()).filter(Boolean),
      featured: form.featured,
      images: form.images,
    };

    try {
      const url = form.id ? `/api/products/${form.id}` : "/api/products";
      const method = form.id ? "PUT" : "POST";
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      if (!res.ok) throw new Error();
      router.push("/admin/products");
      router.refresh();
    } catch {
      setError("Failed to save product. Check required fields.");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="max-w-2xl space-y-6">
      {error && <p className="rounded-button bg-red-50 p-3 text-sm text-red-700">{error}</p>}

      <div>
        <label className="text-sm font-semibold">Product Name</label>
        <input
          required
          value={form.name}
          onChange={(e) => setForm({ ...form, name: e.target.value })}
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Slug</label>
        <input
          required
          value={form.slug}
          onChange={(e) => setForm({ ...form, slug: e.target.value })}
          placeholder="e.g. koeb-air-filter-if-200"
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Category</label>
        <select
          required
          value={form.categoryId}
          onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        >
          <option value="">Select a category</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>{c.name}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm font-semibold">Description</label>
        <textarea
          required
          rows={4}
          value={form.description}
          onChange={(e) => setForm({ ...form, description: e.target.value })}
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Specifications</label>
        <div className="mt-2 space-y-2">
          {specRows.map(([key, value], i) => (
            <div key={i} className="flex flex-col gap-2 sm:flex-row">
              <input
                placeholder="Key (e.g. Power)"
                value={key}
                onChange={(e) => {
                  const rows = [...specRows];
                  rows[i] = [e.target.value, rows[i][1]];
                  setSpecRows(rows);
                }}
                className="w-full rounded-button border border-brand-border px-3 py-2 text-sm sm:w-1/2"
              />
              <input
                placeholder="Value (e.g. 75 HP)"
                value={value}
                onChange={(e) => {
                  const rows = [...specRows];
                  rows[i] = [rows[i][0], e.target.value];
                  setSpecRows(rows);
                }}
                className="w-full rounded-button border border-brand-border px-3 py-2 text-sm sm:w-1/2"
              />
            </div>
          ))}
          <button
            type="button"
            onClick={() => setSpecRows([...specRows, ["", ""]])}
            className="text-xs font-semibold text-brand-red"
          >
            + Add specification row
          </button>
        </div>
      </div>

      <div>
        <label className="text-sm font-semibold">Applications (comma separated)</label>
        <input
          value={applicationsText}
          onChange={(e) => setApplicationsText(e.target.value)}
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
      </div>

      <div>
        <label className="text-sm font-semibold">Features (comma separated)</label>
        <input
          value={featuresText}
          onChange={(e) => setFeaturesText(e.target.value)}
          className="mt-1 w-full rounded-button border border-brand-border px-4 py-3 text-sm"
        />
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="featured"
          checked={form.featured}
          onChange={(e) => setForm({ ...form, featured: e.target.checked })}
        />
        <label htmlFor="featured" className="text-sm">Featured product</label>
      </div>

      <div>
        <label className="text-sm font-semibold">Product Images</label>
        <p className="text-xs text-brand-text/50 mb-2">
          Uploaded here go straight to Cloudinary once your API keys are configured.
        </p>
        <ImageUploader
          value={form.images}
          onChange={(images) => setForm({ ...form, images })}
          multiple
          folder="products"
        />
      </div>

      <Button type="submit" disabled={saving}>
        {saving ? "Saving..." : "Save Product"}
      </Button>
    </form>
  );
}
