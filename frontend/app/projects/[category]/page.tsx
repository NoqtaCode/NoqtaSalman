import { notFound } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, ArrowUpLeft, Images } from "lucide-react";
import { safeFetchFresh } from "../../../lib/sanity";
import { categories, getCategory, sanityCategoryValues } from "../../../lib/brand";
import { defaultGalleryImages } from "../../../lib/default-projects";
import SiteNavbar from "../../../components/layout/SiteNavbar";
import Footer from "../../../components/layout/Footer";
import CategoryGallery from "../../../components/sections/CategoryGallery";
import type { Metadata } from "next";
import { getPublicSiteSettings, getSiteName } from "../../../lib/site-settings";

export const revalidate = 0;
export const dynamic = "force-dynamic";

function resolveCategory(slug: string) {
  if (slug === "shabouk") return getCategory("fences");
  if (slug === "nakheel") return getCategory("palms");
  return getCategory(slug);
}

export async function generateMetadata(props: { params: Promise<{ category: string }> }): Promise<Metadata> {
  const { category: slug } = await props.params;
  const category = resolveCategory(slug);
  const [siteName, settings] = await Promise.all([getSiteName(), getPublicSiteSettings()]);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nakheel-seyaj.com";
  if (!category) return { title: "معرض الأعمال" };
  const isFence = category.slug === "fences";
  const isTheel = category.slug === "theel";
  const title = isFence ? settings.fencesTitle || category.title : isTheel ? settings.theelTitle || category.title : settings.palmsTitle || category.title;
  const description = isFence 
    ? "صور وفيديوهات مشاريع تركيب شبوك المزارع، تسوير الأراضي، والشبوك الأمنية والشائكة بأعلى مواصفات." 
    : isTheel
    ? "صور ومشاريع توريد وتركيب الثيل الطبيعي والصناعي للحدائق والفلل والمساحات الخضراء."
    : "صور وفيديوهات مشاريع توريد وغرس النخيل العربي الأصيل ونخيل الواشنطونيا للقصور والمزارع والفلل.";
  return { 
    title: `صور ومشاريع ${title} | ${siteName}`, 
    description: `${description} نماذج من تنفيذ ${siteName} في المملكة العربية السعودية.`,
    alternates: {
      canonical: `${siteUrl}/projects/${category.slug}`,
    },
    openGraph: {
      title: `صور ومشاريع ${title} | ${siteName}`,
      description,
      url: `${siteUrl}/projects/${category.slug}`,
    }
  };
}

export default async function FullGalleryPage(props: { params: Promise<{ category: string }> }) {
  const { category: slug } = await props.params;
  const category = resolveCategory(slug);
  if (!category) notFound();
  const [settings, sanityImages] = await Promise.all([getPublicSiteSettings(), safeFetchFresh<{ _id: string; title: string; imageUrl: string }[]>(`
    *[(_type == "gallery" || (_type == "project" && status == "published")) && category in $values] | order(_createdAt desc) {
      _id, "title": coalesce(title, ""), "imageUrl": coalesce(image.asset->url, mainImage.asset->url)
    }
  `, [], { values: sanityCategoryValues[category.slug] ?? [] })]);
  
  const fallbackList = defaultGalleryImages[category.slug] || [];
  const images = sanityImages.length > 0 ? sanityImages : fallbackList;

  const isFence = category.slug === "fences";
  const isTheel = category.slug === "theel";
  const categoryTitle = isFence ? settings.fencesTitle || category.title : isTheel ? settings.theelTitle || category.title : settings.palmsTitle || category.title;
  const categoryEyebrow = isFence ? settings.fencesEyebrow || category.eyebrow : isTheel ? settings.theelEyebrow || category.eyebrow : settings.palmsEyebrow || category.eyebrow;
  const categoryDescription = isFence ? settings.fencesDescription || category.description : isTheel ? settings.theelDescription || category.description : settings.palmsDescription || category.description;


  return (
    <div className="min-h-screen bg-[#f7f9f6] text-[#0d231b]" dir="rtl">
      <SiteNavbar />
      <main className="mx-auto max-w-[1400px] px-5 pb-20 pt-32 sm:px-9 sm:pt-40 lg:px-14">
        <section className="relative overflow-hidden rounded-[2rem] bg-[#eaf1df] px-6 py-8 sm:px-10 sm:py-12">
          <div className="relative flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
            <div><span className="inline-flex rounded-full bg-white/80 px-4 py-2 text-xs font-black text-[#688747]">0{categories.findIndex((item) => item.slug === category.slug) + 1} / {categoryEyebrow}</span><h1 className="mt-3 text-4xl font-black sm:text-6xl">{categoryTitle}</h1><p className="mt-3 max-w-2xl text-sm leading-7 text-[#657467] sm:text-base">{categoryDescription}</p></div>
            <span className="inline-flex items-center gap-2 rounded-full bg-white px-4 py-3 text-xs font-black text-[#688747]"><Images size={16} />{String(images.length).padStart(2, "0")} {settings.galleryCountLabel || "صورة"}</span>
          </div>
        </section>

        <section className="mt-8">
          <div className="mb-4 flex items-center justify-between border-b border-[#dfe7dc] pb-3"><h2 className="text-sm font-black">{settings.galleryLabel || "معرض الصور"}</h2><Link href="/gallery" className="inline-flex items-center gap-2 text-xs font-bold text-[#688747] hover:text-[#173a31]">{settings.galleryAllCategoriesLabel || "كل المجالات"} <ArrowUpLeft size={14} /></Link></div>
          {images.length > 0 ? <CategoryGallery images={images} categoryTitle={category.title} /> : (
            <div className="rounded-[2rem] border border-dashed border-[#cbd8c5] bg-white px-5 py-16 text-center sm:py-24">
              <span className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-[#d2bb83] text-[#173a31]"><Images size={20} /></span>
              <h2 className="mt-4 text-xl font-black">{settings.galleryEmptyTitle || `ستضاف صور ${categoryTitle} هنا`}</h2>
              <p className="mx-auto mt-2 max-w-md text-sm leading-7 text-[#77736b]">{settings.galleryEmptyDescription || "عند إضافة صور المشاريع، ستظهر الأعمال في هذا المعرض."}</p>
              <div className="mt-5 flex flex-wrap justify-center gap-4">{categories.filter((item) => item.slug !== category.slug).map((item) => <Link key={item.slug} href={`/projects/${item.slug}`} className="rounded-full bg-[#eef3e8] px-4 py-2 text-xs font-black">شاهد {item.title}</Link>)}</div>
            </div>
          )}
        </section>
        <Link href="/" className="mt-8 inline-flex items-center gap-2 text-sm font-bold text-[#688747] hover:text-[#173a31]"><ArrowLeft size={16} /> العودة للرئيسية</Link>
      </main>
      <Footer />
    </div>
  );
}
