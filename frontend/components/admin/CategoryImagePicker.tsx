"use client";

import { useState } from "react";
import Image from "next/image";
import { Upload } from "lucide-react";

export type CategoryImageOption = {
  assetId: string;
  url: string;
  title: string;
};

type Props = {
  name: string;
  uploadName: string;
  label: string;
  choices: CategoryImageOption[];
  currentAssetId?: string;
  currentImageUrl?: string;
  fallbackUrl: string;
};

async function compressImage(file: File): Promise<File> {
  if (!file.type.startsWith("image/")) return file;
  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 1800;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext("2d");
    if (!ctx) return file;
    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();
    const blob = await new Promise<Blob | null>((resolve) => canvas.toBlob(resolve, "image/jpeg", 0.85));
    if (!blob) return file;
    return new File([blob], file.name.replace(/\.[^.]+$/, ".jpg"), { type: "image/jpeg" });
  } catch {
    return file;
  }
}

export default function CategoryImagePicker({ name, uploadName, label, choices, currentAssetId, currentImageUrl, fallbackUrl }: Props) {
  const [selected, setSelected] = useState(currentAssetId || "__auto__");
  const [fileName, setFileName] = useState("");
  const [localPreview, setLocalPreview] = useState<string | null>(null);

  // Deduplicate choices by assetId so each image appears only once in the dropdown
  const uniqueChoices = choices.filter((choice, index, self) =>
    index === self.findIndex((c) => c.assetId === choice.assetId)
  );

  const current = uniqueChoices.find((choice) => choice.assetId === selected);
  const previewUrl = localPreview || (
    selected === "__auto__"
      ? uniqueChoices[0]?.url || fallbackUrl
      : current?.url || (selected === currentAssetId ? currentImageUrl : undefined) || fallbackUrl
  );

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (!files || files.length === 0) {
      setFileName("");
      setLocalPreview(null);
      return;
    }

    try {
      setLocalPreview(URL.createObjectURL(files[0]));
    } catch {
      // fallback
    }

    if (files.length === 1) {
      setFileName(files[0].name);
    } else {
      setFileName(`تم اختيار ${files.length} صورة`);
    }

    // Automatically optimize images in background if needed
    try {
      const rawList = Array.from(files);
      const dt = new DataTransfer();
      for (const f of rawList) {
        if (f.size > 800 * 1024) {
          const compressed = await compressImage(f);
          dt.items.add(compressed);
        } else {
          dt.items.add(f);
        }
      }
      event.target.files = dt.files;
    } catch {
      // Keep original files if DataTransfer isn't supported
    }
  };

  return (
    <div className="space-y-3 rounded-2xl border border-slate-200/80 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between">
        <label htmlFor={name} className="block text-sm font-black text-slate-800">{label}</label>
        {fileName && (
          <span className="rounded-full bg-blue-50 px-2.5 py-0.5 text-[11px] font-bold text-blue-700 border border-blue-200">
            {fileName}
          </span>
        )}
      </div>

      <div className="relative h-44 overflow-hidden rounded-xl bg-slate-100 border border-slate-200/60">
        <Image src={previewUrl} alt={`معاينة ${label}`} fill unoptimized sizes="420px" className="object-cover" />
        {localPreview ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-emerald-600/90 px-3 py-1 text-[11px] font-bold text-white shadow">
            معاينة الصورة الجديدة المحددة
          </span>
        ) : selected === "__auto__" ? (
          <span className="absolute bottom-2 right-2 rounded-full bg-slate-900/75 px-3 py-1 text-[11px] font-bold text-white">
            أحدث صورة من القسم
          </span>
        ) : null}
      </div>

      <select
        id={name}
        name={name}
        value={selected}
        onChange={(event) => {
          setSelected(event.target.value);
          setLocalPreview(null);
        }}
        className="w-full rounded-xl border border-slate-200 bg-slate-50 p-3 text-sm font-bold text-slate-800 outline-none focus:border-blue-500 focus:bg-white transition"
      >
        <option value="__auto__">تلقائيًا: أحدث صورة مرفوعة في هذا القسم</option>
        {currentAssetId && !uniqueChoices.some((choice) => choice.assetId === currentAssetId) && (
          <option value={currentAssetId}>الصورة المختارة حاليًا</option>
        )}
        {uniqueChoices.map((choice, index) => (
          <option key={`${choice.assetId}-${index}`} value={choice.assetId}>{choice.title || `صورة ${index + 1}`}</option>
        ))}
      </select>

      <p className="text-xs leading-5 text-slate-500">
        الوضع التلقائي يعرض أحدث صورة محفوظة في قاعدة البيانات لهذا القسم. أو اختر صورة محددة من القائمة.
      </p>

      <div className="flex flex-wrap items-center gap-3 border-t border-slate-100 pt-3">
        <label
          htmlFor={`${name}-upload`}
          className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#173a31] px-5 text-xs font-black text-white transition hover:bg-[#285448] shadow-sm hover:shadow"
        >
          <Upload size={16} /> رفع الصور
        </label>
        <input
          id={`${name}-upload`}
          name={uploadName}
          type="file"
          multiple
          accept="image/*"
          className="sr-only"
          onChange={handleFileChange}
        />
        <span className="min-w-0 truncate text-xs font-medium text-slate-600">
          {fileName || "JPG أو PNG أو WebP"}
        </span>
      </div>
      <p className="text-[11px] leading-5 text-slate-400">
        💡 يمكنك تحديد صورة أو عدة صور دفعة واحدة، وسيتم حفظها للقسم وإضافتها لمعرض الصور تلقائياً.
      </p>
    </div>
  );
}
