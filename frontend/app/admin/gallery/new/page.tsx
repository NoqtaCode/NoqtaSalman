import Link from "next/link";
import { ArrowRight } from "lucide-react";
import GalleryUploadForm from "../../../../components/admin/GalleryUploadForm";

export default async function NewGalleryUpload({ searchParams }: { searchParams: Promise<{ category?: string }> }) {
  const { category } = await searchParams;
  const initialCategory = category === 'palms' ? 'palms' : category === 'theel' ? 'theel' : 'fences';

  return (
    <div className="max-w-3xl mx-auto px-4 pb-20">
      <div className="flex items-center gap-4 mb-8 pt-4">
        <Link href="/admin/gallery" className="bg-white p-3 rounded-2xl border border-gray-200 text-slate-700 shadow-sm hover:bg-gray-50 transition">
          <ArrowRight size={22} />
        </Link>
        <div>
          <h1 className="text-2xl font-black text-slate-800">
            رفع صور لمعرض وعرض {initialCategory === 'palms' ? 'النخيل' : initialCategory === 'theel' ? 'الثيل' : 'الشبوك'}
          </h1>
          <p className="text-xs text-slate-500 mt-1">حدد أي عدد من الصور دفعة واحدة وسيتم ربطها بالقسم وعرضها في الموقع تلقائياً</p>
        </div>
      </div>

      <div className="bg-white rounded-[2rem] shadow-xl p-6 md:p-10 border border-slate-100">
        <GalleryUploadForm initialCategory={initialCategory} />
      </div>
    </div>
  );
}
