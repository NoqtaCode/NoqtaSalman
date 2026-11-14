'use client';

import { useState, useRef } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import { ImagePlus, X, UploadCloud, CheckCircle2, AlertCircle, Loader2, Plus, Trash2 } from 'lucide-react';
import { uploadGalleryBatch } from '../../actions/gallery';

type PreviewFile = {
  id: string;
  file: File;
  previewUrl: string;
};

// ضغط وتجهيز الصورة في المتصفح لتسريع الرفع بشكل خيالي
async function compressImageIfNeeded(file: File): Promise<File> {
  // إذا كانت الصورة أقل من 1.5 ميجا بايت لا داعي لضغطها
  if (file.size <= 1.5 * 1024 * 1024) return file;

  try {
    const bitmap = await createImageBitmap(file);
    const maxDimension = 2000;
    const scale = Math.min(1, maxDimension / Math.max(bitmap.width, bitmap.height));
    const canvas = document.createElement('canvas');
    canvas.width = Math.round(bitmap.width * scale);
    canvas.height = Math.round(bitmap.height * scale);
    const ctx = canvas.getContext('2d');
    if (!ctx) return file;

    ctx.drawImage(bitmap, 0, 0, canvas.width, canvas.height);
    bitmap.close();

    const blob = await new Promise<Blob | null>((resolve) => 
      canvas.toBlob(resolve, 'image/webp', 0.85)
    );
    if (!blob) return file;

    return new File([blob], `${file.name.replace(/\.[^.]+$/, '')}.webp`, { type: 'image/webp' });
  } catch {
    return file;
  }
}

export default function GalleryUploadForm({ initialCategory = 'fences' }: { initialCategory?: 'fences' | 'palms' | 'theel' }) {
  const router = useRouter();
  const fileInputRef = useRef<HTMLInputElement>(null);

  const [category, setCategory] = useState<'fences' | 'palms' | 'theel'>(initialCategory);
  const [selectedFiles, setSelectedFiles] = useState<PreviewFile[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [statusMessage, setStatusMessage] = useState('');
  const [errorMessage, setErrorMessage] = useState('');

  // إضافة الصور عند اختيارها من المعرض
  function handleFileSelect(e: React.ChangeEvent<HTMLInputElement>) {
    setErrorMessage('');
    const incomingFiles = Array.from(e.target.files || []);
    if (!incomingFiles.length) return;

    const newPreviewFiles: PreviewFile[] = incomingFiles
      .filter((file) => file.type.startsWith('image/') || /\.(jpe?g|png|webp|heic|avif)$/i.test(file.name))
      .map((file) => ({
        id: `${file.name}-${file.size}-${Math.random().toString(36).slice(2, 7)}`,
        file,
        previewUrl: URL.createObjectURL(file),
      }));

    if (newPreviewFiles.length === 0) {
      setErrorMessage('يرجى اختيار ملفات صور صالحة.');
      return;
    }

    // دمج الصور الجديدة مع الصور المحددة سابقاً
    setSelectedFiles((prev) => [...prev, ...newPreviewFiles]);

    // إعادة تصفير الـ input للسماح باختيار نفس الصورة مجدداً إن أراد
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  }

  // حذف صورة محددة من القائمة
  function removeFile(idToRemove: string) {
    setSelectedFiles((prev) => {
      const filtered = prev.filter((item) => {
        if (item.id === idToRemove) {
          URL.revokeObjectURL(item.previewUrl);
          return false;
        }
        return true;
      });
      return filtered;
    });
  }

  // تفريغ الكل
  function clearAll() {
    selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
    setSelectedFiles([]);
    setErrorMessage('');
    setStatusMessage('');
  }

  // بدء عملية الرفع
  async function handleUpload() {
    if (!selectedFiles.length || isUploading) return;

    setIsUploading(true);
    setErrorMessage('');
    setUploadProgress(0);
    setStatusMessage('جار تجهيز وضغط الصور للرفع السريع...');

    try {
      const totalCount = selectedFiles.length;
      let uploadedSoFar = 0;
      const batchSize = 4; // رفع كل 4 صور في دفعة واحدة لضمان السرعة والثبات

      // تجهيز الصور
      const preparedFiles: File[] = [];
      for (let i = 0; i < selectedFiles.length; i++) {
        setStatusMessage(`جار معالجة الصورة ${i + 1} من ${totalCount}...`);
        const compressed = await compressImageIfNeeded(selectedFiles[i].file);
        preparedFiles.push(compressed);
      }

      // إرسال على دفعات
      for (let i = 0; i < preparedFiles.length; i += batchSize) {
        const batch = preparedFiles.slice(i, i + batchSize);
        setStatusMessage(`جار رفع الصور (${Math.min(i + batch.length, totalCount)} من ${totalCount})...`);

        const formData = new FormData();
        formData.set('category', category);
        batch.forEach((file) => {
          formData.append('images', file);
        });

        const result = await uploadGalleryBatch(formData);
        if (!result.success && result.createdCount === 0) {
          throw new Error(result.error || 'فشل رفع إحدى الدفعات. يرجى المحاولة مجدداً.');
        }

        uploadedSoFar += batch.length;
        setUploadProgress(Math.round((uploadedSoFar / totalCount) * 100));
      }

      setStatusMessage(`تم رفع جميع الصور (${totalCount} صورة) بنجاح! 🎉`);
      
      // تنظيف روابط المعاينة
      selectedFiles.forEach((f) => URL.revokeObjectURL(f.previewUrl));
      
      // التوجيه إلى المعرض بعد ثانية واحدة
      setTimeout(() => {
        router.push(`/admin/gallery?uploaded=${totalCount}`);
        router.refresh();
      }, 1000);

    } catch (err: any) {
      console.error(err);
      setErrorMessage(err.message || 'حدث خطأ أثناء الرفع، يرجى التحقق من اتصال الإنترنت.');
      setIsUploading(false);
    }
  }

  return (
    <div className="space-y-7">
      
      {/* 1. اختيار القسم */}
      <div>
        <label className="block text-sm font-black text-slate-800 mb-2.5">
          القسم الذي ستنزل فيه الصور *
        </label>
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          <button
            type="button"
            onClick={() => setCategory('fences')}
            className={`flex items-center justify-center gap-2 rounded-2xl p-4 font-black transition border-2 ${
              category === 'fences'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>قسم الشبوك والتسوير</span>
            {category === 'fences' && <CheckCircle2 size={18} className="text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => setCategory('palms')}
            className={`flex items-center justify-center gap-2 rounded-2xl p-4 font-black transition border-2 ${
              category === 'palms'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>قسم توريد وزراعة النخيل</span>
            {category === 'palms' && <CheckCircle2 size={18} className="text-blue-600" />}
          </button>

          <button
            type="button"
            onClick={() => setCategory('theel')}
            className={`flex items-center justify-center gap-2 rounded-2xl p-4 font-black transition border-2 ${
              category === 'theel'
                ? 'border-blue-600 bg-blue-50 text-blue-700 shadow-sm'
                : 'border-slate-100 bg-slate-50/50 text-slate-600 hover:bg-slate-100'
            }`}
          >
            <span>قسم توريد وتركيب الثيل</span>
            {category === 'theel' && <CheckCircle2 size={18} className="text-blue-600" />}
          </button>
        </div>
      </div>

      {/* 2. منطقة اختيار وسحب الصور */}
      <div>
        <label className="block text-sm font-black text-slate-800 mb-2.5">
          اختيار الصور (حدد أي عدد من الصور مرة واحدة) *
        </label>
        
        <input
          ref={fileInputRef}
          type="file"
          accept="image/*"
          multiple
          disabled={isUploading}
          onChange={handleFileSelect}
          className="hidden"
          id="gallery-file-input"
        />

        <div
          onClick={() => fileInputRef.current?.click()}
          className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-12 text-center cursor-pointer transition-all duration-300 ${
            selectedFiles.length > 0 
              ? 'border-blue-300 bg-blue-50/20 hover:bg-blue-50/40' 
              : 'border-slate-200 bg-slate-50/40 hover:bg-slate-50 hover:border-blue-400'
          }`}
        >
          <div className="flex flex-col items-center">
            <span className="flex h-16 w-16 items-center justify-center rounded-2xl bg-blue-100/70 text-blue-600 mb-3 shadow-inner">
              <ImagePlus size={32} />
            </span>
            <h4 className="text-lg font-black text-slate-800">
              {selectedFiles.length > 0 ? 'اضغط لإضافة صور أخرى للقائمة' : 'اضغط هنا لاختيار الصور من جهازك'}
            </h4>
            <p className="mt-1.5 text-xs sm:text-sm text-slate-500 max-w-sm">
              يمكنك تحديد صور متعددة دفعة واحدة من استوديو الصور أو السحب والإفلات مباشرة
            </p>
            <span className="mt-3 inline-flex items-center gap-1.5 rounded-full bg-white px-3.5 py-1 text-xs font-bold text-blue-700 shadow-sm border border-slate-200">
              يدعم جميع صيغ الصور بدون حد لعدد الصور
            </span>
          </div>
        </div>
      </div>

      {/* 3. شريط الحالة والأخطاء */}
      {errorMessage && (
        <div className="flex items-center gap-2 rounded-2xl border border-red-200 bg-red-50 p-4 text-xs sm:text-sm font-bold text-red-700">
          <AlertCircle size={18} className="shrink-0" />
          <span>{errorMessage}</span>
        </div>
      )}

      {statusMessage && (
        <div className="rounded-2xl border border-blue-200 bg-blue-50/80 p-4 text-xs sm:text-sm font-bold text-blue-800">
          <div className="flex items-center justify-between mb-2">
            <span>{statusMessage}</span>
            {isUploading && <span className="font-mono text-xs">{uploadProgress}%</span>}
          </div>
          {isUploading && (
            <div className="h-2 w-full overflow-hidden rounded-full bg-blue-200">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${uploadProgress}%` }}
              />
            </div>
          )}
        </div>
      )}

      {/* 4. شبكة معاينة الصور المحددة */}
      {selectedFiles.length > 0 && (
        <div>
          <div className="flex items-center justify-between mb-3 px-1">
            <div className="flex items-center gap-2">
              <span className="font-black text-slate-800 text-sm">الصور المحددة للرفع:</span>
              <span className="rounded-full bg-blue-600 px-2.5 py-0.5 text-xs font-bold text-white">
                {selectedFiles.length} صورة
              </span>
            </div>
            {!isUploading && (
              <button
                type="button"
                onClick={clearAll}
                className="inline-flex items-center gap-1 text-xs font-bold text-red-600 hover:text-red-700 transition"
              >
                <Trash2 size={13} />
                مسح الكل
              </button>
            )}
          </div>

          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3 max-h-[360px] overflow-y-auto p-2 border border-slate-100 rounded-2xl bg-slate-50/50">
            {selectedFiles.map((item, index) => (
              <div
                key={item.id}
                className="group relative aspect-square overflow-hidden rounded-xl bg-slate-200 border border-slate-200 shadow-sm"
              >
                <Image
                  src={item.previewUrl}
                  alt={item.file.name}
                  fill
                  unoptimized
                  className="object-cover"
                />
                
                {/* رقم الصورة */}
                <span className="absolute top-1.5 right-1.5 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-[10px] font-bold text-white backdrop-blur-sm">
                  {index + 1}
                </span>

                {/* زر الحذف */}
                {!isUploading && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      removeFile(item.id);
                    }}
                    title="حذف هذه الصورة"
                    className="absolute top-1.5 left-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-red-600 text-white shadow-md transition hover:scale-110 active:scale-95"
                  >
                    <X size={13} />
                  </button>
                )}
              </div>
            ))}

            {/* بطاقة لإضافة المزيد */}
            {!isUploading && (
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="flex aspect-square flex-col items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-slate-300 bg-white text-slate-500 hover:border-blue-500 hover:text-blue-600 transition"
              >
                <Plus size={22} />
                <span className="text-[11px] font-bold">إضافة صور</span>
              </button>
            )}
          </div>
        </div>
      )}

      {/* 5. زر التنفيذ والرفع */}
      <div className="pt-2">
        <button
          type="button"
          onClick={handleUpload}
          disabled={isUploading || selectedFiles.length === 0}
          className={`w-full py-4 rounded-2xl font-black text-base text-white flex items-center justify-center gap-2.5 shadow-lg transition-all duration-300 ${
            isUploading || selectedFiles.length === 0
              ? 'bg-slate-300 cursor-not-allowed text-slate-500'
              : 'bg-blue-600 hover:bg-blue-700 active:scale-98 shadow-blue-600/25'
          }`}
        >
          {isUploading ? (
            <>
              <Loader2 className="animate-spin" size={20} />
              <span>جار رفع {selectedFiles.length} صورة...</span>
            </>
          ) : (
            <>
              <UploadCloud size={22} />
              <span>
                {selectedFiles.length > 0
                  ? `رفع ${selectedFiles.length} صورة دفعة واحدة إلى المعرض`
                  : 'حدد الصور لبدء الرفع'}
              </span>
            </>
          )}
        </button>
      </div>

    </div>
  );
}
