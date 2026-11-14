'use client';

import { useState } from "react";
import { Upload } from "lucide-react";

type Props = {
  name: string;
  buttonText: string;
  accept?: string;
  emptyText: string;
};

export default function SettingsImageUpload({ name, buttonText, accept = "image/jpeg,image/png,image/webp", emptyText }: Props) {
  const [fileName, setFileName] = useState("");

  return (
    <div className="flex flex-wrap items-center gap-3">
      <input
        id={`${name}-upload`}
        name={name}
        type="file"
        accept={accept}
        className="sr-only"
        onChange={(event) => setFileName(event.target.files?.[0]?.name || "")}
      />
      <label htmlFor={`${name}-upload`} className="inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-xl bg-[#173a31] px-4 text-xs font-black text-white transition hover:bg-[#285448]">
        <Upload size={15} /> {buttonText}
      </label>
      <span className="max-w-full truncate text-xs text-slate-500">{fileName || emptyText}</span>
    </div>
  );
}
