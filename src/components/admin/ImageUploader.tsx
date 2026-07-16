"use client";

import { useState } from "react";
import Image from "next/image";
import { UploadCloud, X } from "lucide-react";

export type UploadedImage = { url: string; publicId: string };

export default function ImageUploader({
  value,
  onChange,
  multiple = false,
  folder = "general",
}: {
  value: UploadedImage[];
  onChange: (images: UploadedImage[]) => void;
  multiple?: boolean;
  folder?: string;
}) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setLoading(true);
    setError("");

    try {
      const uploads: UploadedImage[] = [];
      for (const file of Array.from(files)) {
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
        uploads.push({ url: media.url, publicId: media.publicId });
      }

      onChange(multiple ? [...value, ...uploads] : uploads);
    } catch {
      setError("Upload failed — check your Cloudinary credentials in .env");
    } finally {
      setLoading(false);
    }
  };

  const removeAt = (i: number) => onChange(value.filter((_, idx) => idx !== i));

  return (
    <div>
      <label className="flex cursor-pointer flex-col items-center justify-center rounded-button border-2 border-dashed border-brand-border bg-brand-light px-4 py-8 text-center text-sm text-brand-text/60 hover:border-brand-red">
        <UploadCloud size={22} className="mb-2 text-brand-red" />
        {loading ? "Uploading..." : "Click to upload image" + (multiple ? "s" : "")}
        <input
          type="file"
          accept="image/*"
          multiple={multiple}
          hidden
          onChange={(e) => handleFiles(e.target.files)}
        />
      </label>
      {error && <p className="mt-2 text-xs text-red-600">{error}</p>}

      {value.length > 0 && (
        <div className="mt-4 grid grid-cols-3 gap-3 sm:grid-cols-4">
          {value.map((img, i) => (
            <div key={img.publicId + i} className="relative h-20 overflow-hidden rounded-button bg-white">
              <Image src={img.url} alt="" fill className="object-contain p-1" />
              <button
                type="button"
                onClick={() => removeAt(i)}
                className="absolute right-1 top-1 rounded-full bg-black/60 p-1 text-white"
              >
                <X size={12} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
