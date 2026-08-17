"use client";

import { useEffect, useState } from "react";
import ImageUploader, { UploadedImage } from "@/components/admin/ImageUploader";
import Button from "@/components/ui/Button";

type FeatureCard = { icon: string; title: string; description: string };

export default function AdminHomepagePage() {
  const [form, setForm] = useState({
    heroTitleLine1: "",
    heroTitleLine2: "",
    heroSubtitle: "",
    heroPrimaryLabel: "",
    heroPrimaryHref: "",
    heroSecondaryLabel: "",
    heroSecondaryHref: "",
    aboutHeading: "",
    aboutBody: "",
  });
  const [heroImage, setHeroImage] = useState<UploadedImage[]>([]);
  const [aboutImage, setAboutImage] = useState<UploadedImage[]>([]);
  const [galleryImages, setGalleryImages] = useState<UploadedImage[][]>([[], [], [], []]);
  const [features, setFeatures] = useState<FeatureCard[]>([]);
  const [saved, setSaved] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/homepage")
      .then((r) => r.json())
      .then((data) => {
        if (data) {
          setForm({
            heroTitleLine1: data.heroTitleLine1,
            heroTitleLine2: data.heroTitleLine2,
            heroSubtitle: data.heroSubtitle,
            heroPrimaryLabel: data.heroPrimaryLabel,
            heroPrimaryHref: data.heroPrimaryHref,
            heroSecondaryLabel: data.heroSecondaryLabel,
            heroSecondaryHref: data.heroSecondaryHref,
            aboutHeading: data.aboutHeading,
            aboutBody: data.aboutBody,
          });
          if (data.heroImageUrl) setHeroImage([{ url: data.heroImageUrl, publicId: "" }]);
          if (data.aboutImageUrl) setAboutImage([{ url: data.aboutImageUrl, publicId: "" }]);
          setGalleryImages([
            data.galleryImage1Url ? [{ url: data.galleryImage1Url, publicId: data.galleryImage1PublicId || "" }] : [],
            data.galleryImage2Url ? [{ url: data.galleryImage2Url, publicId: data.galleryImage2PublicId || "" }] : [],
            data.galleryImage3Url ? [{ url: data.galleryImage3Url, publicId: data.galleryImage3PublicId || "" }] : [],
            data.galleryImage4Url ? [{ url: data.galleryImage4Url, publicId: data.galleryImage4PublicId || "" }] : [],
          ]);
          setFeatures(data.featureCards || []);
        }
        setLoading(false);
      });
  }, []);

  const save = async (e: React.FormEvent) => {
    e.preventDefault();
    await fetch("/api/homepage", {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        ...form,
        heroImageUrl: heroImage[0]?.url,
        aboutImageUrl: aboutImage[0]?.url,
        galleryImage1Url: galleryImages[0][0]?.url ?? null,
        galleryImage1PublicId: galleryImages[0][0]?.publicId ?? null,
        galleryImage2Url: galleryImages[1][0]?.url ?? null,
        galleryImage2PublicId: galleryImages[1][0]?.publicId ?? null,
        galleryImage3Url: galleryImages[2][0]?.url ?? null,
        galleryImage3PublicId: galleryImages[2][0]?.publicId ?? null,
        galleryImage4Url: galleryImages[3][0]?.url ?? null,
        galleryImage4PublicId: galleryImages[3][0]?.publicId ?? null,
        featureCards: features,
      }),
    });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (loading) return <p className="text-sm text-brand-text/60">Loading...</p>;

  return (
    <div>
      <h1 className="font-heading text-2xl font-bold">Homepage Content</h1>
      <p className="mt-1 text-sm text-brand-text/60">Edit everything shown on the homepage without touching code.</p>

      <form onSubmit={save} className="mt-6 max-w-2xl space-y-8">
        <section className="rounded-card bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold">Hero Section</h2>
          <div className="mt-4 space-y-3">
            <input
              placeholder="Heading line 1"
              value={form.heroTitleLine1}
              onChange={(e) => setForm({ ...form, heroTitleLine1: e.target.value })}
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
            />
            <input
              placeholder="Heading line 2"
              value={form.heroTitleLine2}
              onChange={(e) => setForm({ ...form, heroTitleLine2: e.target.value })}
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
            />
            <textarea
              placeholder="Subtitle"
              value={form.heroSubtitle}
              onChange={(e) => setForm({ ...form, heroSubtitle: e.target.value })}
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
            />
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              <input
                placeholder="Primary button label"
                value={form.heroPrimaryLabel}
                onChange={(e) => setForm({ ...form, heroPrimaryLabel: e.target.value })}
                className="rounded-button border border-brand-border px-4 py-3 text-sm"
              />
              <input
                placeholder="Primary button link"
                value={form.heroPrimaryHref}
                onChange={(e) => setForm({ ...form, heroPrimaryHref: e.target.value })}
                className="rounded-button border border-brand-border px-4 py-3 text-sm"
              />
              <input
                placeholder="Secondary button label"
                value={form.heroSecondaryLabel}
                onChange={(e) => setForm({ ...form, heroSecondaryLabel: e.target.value })}
                className="rounded-button border border-brand-border px-4 py-3 text-sm"
              />
              <input
                placeholder="Secondary button link"
                value={form.heroSecondaryHref}
                onChange={(e) => setForm({ ...form, heroSecondaryHref: e.target.value })}
                className="rounded-button border border-brand-border px-4 py-3 text-sm"
              />
            </div>
            <p className="text-sm font-semibold pt-2">Hero background image</p>
            <ImageUploader value={heroImage} onChange={setHeroImage} folder="homepage" />
          </div>
        </section>

        <section className="rounded-card bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold">Feature Cards</h2>
          <div className="mt-4 space-y-4">
            {features.map((f, i) => (
              <div key={i} className="grid grid-cols-1 gap-2 rounded-button border border-brand-border p-4 sm:grid-cols-3">
                <input
                  placeholder="Title"
                  value={f.title}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], title: e.target.value };
                    setFeatures(next);
                  }}
                  className="rounded-button border border-brand-border px-3 py-2 text-sm"
                />
                <input
                  placeholder="Description"
                  value={f.description}
                  onChange={(e) => {
                    const next = [...features];
                    next[i] = { ...next[i], description: e.target.value };
                    setFeatures(next);
                  }}
                  className="rounded-button border border-brand-border px-3 py-2 text-sm sm:col-span-2"
                />
              </div>
            ))}
          </div>
        </section>

        <section className="rounded-card bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold">About Section</h2>
          <div className="mt-4 space-y-3">
            <input
              placeholder="Heading"
              value={form.aboutHeading}
              onChange={(e) => setForm({ ...form, aboutHeading: e.target.value })}
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
            />
            <textarea
              rows={4}
              placeholder="Body copy"
              value={form.aboutBody}
              onChange={(e) => setForm({ ...form, aboutBody: e.target.value })}
              className="w-full rounded-button border border-brand-border px-4 py-3 text-sm"
            />
            <p className="text-sm font-semibold pt-2">About image</p>
            <ImageUploader value={aboutImage} onChange={setAboutImage} folder="homepage" />
          </div>
        </section>

        <section className="rounded-card bg-white p-6 shadow-sm">
          <h2 className="font-heading font-semibold">About Us Gallery</h2>
          <p className="mt-1 text-xs text-brand-text/50">
            Four images shown in the About Us page gallery. Upload, preview and replace or delete
            each one independently.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-6 sm:grid-cols-2">
            {galleryImages.map((img, i) => (
              <div key={i}>
                <p className="text-sm font-semibold">Gallery image {i + 1}</p>
                <div className="mt-2">
                  <ImageUploader
                    value={img}
                    onChange={(next) => {
                      const updated = [...galleryImages];
                      updated[i] = next;
                      setGalleryImages(updated);
                    }}
                    folder="about-gallery"
                  />
                </div>
              </div>
            ))}
          </div>
        </section>

        <Button type="submit">Save Changes</Button>
        {saved && <p className="text-sm text-green-700">Saved.</p>}
      </form>
    </div>
  );
}
