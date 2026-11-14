'use client';

import { useState } from "react";
import Image from "next/image";
import Lightbox from "yet-another-react-lightbox";
import "yet-another-react-lightbox/styles.css";

type GalleryImage = {
  _id: string;
  title?: string | null;
  imageUrl: string;
};

export default function CategoryGallery({ images, categoryTitle }: { images: GalleryImage[]; categoryTitle: string }) {
  const [activeIndex, setActiveIndex] = useState(-1);
  const slides = images.map((image, index) => ({
    src: image.imageUrl,
    alt: image.title || `${categoryTitle} — صورة ${index + 1}`,
  }));

  return (
    <>
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
        {images.map((image, index) => (
          <button
            key={image._id}
            type="button"
            onClick={() => setActiveIndex(index)}
            aria-label={`عرض صورة ${index + 1} من ${categoryTitle}`}
            className="group relative block aspect-[4/5] overflow-hidden rounded-2xl bg-[#dce4d2] text-right shadow-sm"
          >
            <Image
              src={image.imageUrl}
              alt={image.title || `${categoryTitle} — صورة ${index + 1}`}
              fill
              unoptimized
              sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 360px"
              className="object-cover transition duration-700 group-hover:scale-105"
            />
            {/* شارة الترقيم فقط في زاوية الصورة بدون أسماء */}
            <span className="absolute bottom-3 right-3 flex h-8 w-8 items-center justify-center rounded-full bg-[#10261e]/85 text-[#dca842] border border-white/20 backdrop-blur-md text-xs font-black shadow-lg sm:bottom-4 sm:right-4 sm:h-9 sm:w-9 sm:text-sm transition-transform duration-300 group-hover:scale-110 group-hover:bg-[#dca842] group-hover:text-[#10261e]">
              {String(index + 1).padStart(2, "0")}
            </span>
          </button>
        ))}
      </div>

      <Lightbox index={activeIndex} open={activeIndex >= 0} close={() => setActiveIndex(-1)} slides={slides} />
    </>
  );
}
