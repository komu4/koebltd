"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X, RefreshCw } from "lucide-react";

export type UploadedImage = { url: string; publicId: string };

const MAX_IMAGES = 4;

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "general",
  max = multiple ? MAX_IMAGES : 1,
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  folder?: string;
  max?: number;
}) {
  const [loading, setLoading] = useState<number | "add" | null>(null);
  const [error, setError] = useState("");

  const uploadFile = async (file: File): Promise<UploadedImage> => {
    const dataUrl = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result as string);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
    const res = await fetch("/api/upload", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ dataUrl, name: file.name, folder }),
    });
    if (!res.ok) throw new Error("Upload failed");
    const media = await res.json();
    return { url: media.url, publicId: media.publicId };
  };

  // Add one or more new images (up to remaining slots)
  const handleAdd = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    const remaining = max - value.length;
    if (remaining <= 0) return;

    setLoading("add");
    setError("");
    try {
      const toUpload = Array.from(files).slice(0, remaining);
      const uploads: UploadedImage[] = [];
      for (const file of toUpload) {
        uploads.push(await uploadFile(file));
      }
      onChange([...value, ...uploads]);
    } catch {
      setError("Upload failed , check your Cloudinary credentials in .env");
    } finally {
      setLoading(null);
    }
  };

  // Replace a single slot
  const handleReplace = async (index: number, files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(index);
    setError("");
    try {
      const uploaded = await uploadFile(files[0]);
      const next = [...value];
      next[index] = uploaded;
      onChange(next);
    } catch {
      setError("Upload failed , check your Cloudinary credentials in .env");
    } finally {
      setLoading(null);
    }
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  const canAddMore = multiple && value.length < max;

  return (
    <div className="space-y-3">
      {/* Existing image slots */}
      {value.length > 0 && (
        <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
          {value.map((img, i) => (
            <div
              key={img.publicId + i}
              className="group relative overflow-hidden rounded-button bg-brand-light border border-brand-border"
              style={{ aspectRatio: "1 / 1" }}
            >
              <Image
                src={img.url}
                alt={`Product image ${i + 1}`}
                fill
                                sizes="(max-width: 640px) 50vw, 25vw"
                className="object-contain p-2"
              />
              {/* Overlay on hover */}
              <div className="absolute inset-0 flex items-center justify-center gap-1.5 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
                {/* Replace button */}
                <label
                  className="flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-white/90 text-brand-text hover:bg-white"
                  title="Replace image"
                >
                  {loading === i ? (
                    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-red border-t-transparent" />
                  ) : (
                    <RefreshCw size={13} />
                  )}
                  <input
                    type="file"
                    accept="image/*"
                    hidden
                    disabled={loading !== null}
                    onChange={(e) => handleReplace(i, e.target.files)}
                  />
                </label>
                {/* Remove button */}
                <button
                  type="button"
                  onClick={() => removeAt(i)}
                  disabled={loading !== null}
                  className="flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-brand-text hover:bg-white"
                  title="Remove image"
                >
                  <X size={13} />
                </button>
              </div>
              {/* Slot label */}
              <span className="absolute bottom-1 left-1 rounded bg-black/50 px-1.5 py-0.5 text-[10px] text-white">
                {i + 1}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* Add more images / primary upload zone */}
      {(value.length === 0 || canAddMore) && (
        <label className="flex cursor-pointer flex-col items-center justify-center rounded-button border-2 border-dashed border-brand-border bg-brand-light px-4 py-8 text-center text-sm text-brand-text/60 hover:border-brand-red transition-colors">
          <UploadCloud size={22} className="mb-2 text-brand-red" />
          {loading === "add" ? (
            <span>Uploading...</span>
          ) : (
            <span>
              {value.length === 0
                ? `Click to upload image${multiple ? "s" : ""}`
                : `Add more (${value.length}/${max})`}
            </span>
          )}
          <input
            type="file"
            accept="image/*"
            multiple={multiple}
            hidden
            disabled={loading !== null}
            onChange={(e) => handleAdd(e.target.files)}
          />
        </label>
      )}

      {/* Cap reached notice */}
      {multiple && value.length >= max && (
        <p className="text-xs text-brand-text/50">
          Maximum {max} images reached. Remove or replace to change images.
        </p>
      )}

      {error && <p className="text-xs text-red-600">{error}</p>}
    </div>
  );
}
