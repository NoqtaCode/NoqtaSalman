import { safeFetchFresh } from "../../../lib/sanity";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowLeft, ArrowUpLeft, Sprout } from "lucide-react";
import SiteNavbar from "../../../components/layout/SiteNavbar";
import Footer from "../../../components/layout/Footer";
import type { Metadata } from "next";
import { getPublicSiteSettings, getSiteName } from "../../../lib/site-settings";

export const dynamic = "force-dynamic";

async function getProject(slug: string) {
  return safeFetchFresh<any>(`
    *[_type == "project" && slug.current == $slug && category in ["palms", "fences", "nakheel", "shabouk"]][0] {
      title, description, category, "imageUrl": mainImage.asset->url, _createdAt
    }
  `, null, { slug });
}

export async function generateMetadata(props: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await props.params;
  const decodedSlug = decodeURIComponent(slug);
  const project = await getProject(decodedSlug);
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL?.replace(/\/$/, "") || "https://nakheel-seyaj.com";
  if (!project) return { title: "المشروع غير موجود" };
  return {
    title: project.title,
    description: project.description || `تعرّف على تفاصيل مشروع ${project.title} المنفذ بأعلى معايير الجودة والإتقان.`,
    alternates: {
      canonical: `${siteUrl}/project/${encodeURIComponent(decodedSlug)}`,
    },
    openGraph: {
      title: project.title,
      description: project.description || `تفاصيل مشروع ${project.title}`,
      url: `${siteUrl}/project/${encodeURIComponent(decodedSlug)}`,
      ...(project.imageUrl ? { images: [{ url: project.imageUrl, alt: project.title }] } : {}),
    },
  };
}

export default async function ProjectDetails(props: { params: Promise<{ slug: string }> }) {
  const { slug } = await props.params;
  const [project, siteName, settings] = await Promise.all([
    getProject(decodeURIComponent(slug)),
    getSiteName(),
    getPublicSiteSettings(),
  ]);
  if (!project) notFound();

  return (
    <div className="min-h-screen bg-[#f3f5ef] text-[#173a31]" dir="rtl">
      <SiteNavbar />
      <main className="mx-auto max-w-[1200px] px-5 pb-20 pt-32 sm:px-9 sm:pt-40">
        <Link href="/gallery" className="mb-5 inline-flex items-center gap-2 text-sm font-bold text-[#688747] hover:text-[#173a31]"><ArrowLeft size={16} /> {settings.detailBackLabel || "العودة إلى معرض الأعمال"}</Link>
        <article className="overflow-hidden rounded-[2rem] bg-white shadow-sm ring-1 ring-[#e5ece1]">
          {project.imageUrl ? (
            <div className="relative min-h-[400px] bg-[#dce4d2] sm:min-h-[620px]">
              <Image src={project.imageUrl} alt={project.title} fill unoptimized priority sizes="100vw" className="object-cover" />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:p-10">
                <span className="mb-3 inline-flex items-center gap-2 text-xs font-bold text-[#d2bb83]"><Sprout size={15} /> {settings.detailByline || "من أعمال"} {siteName}</span>
                <h1 className="max-w-3xl text-3xl font-black sm:text-5xl">{project.title}</h1>
                {project._createdAt && <p className="mt-3 text-xs font-bold text-white/65">أضيف في {new Date(project._createdAt).toLocaleDateString("ar-SA")}</p>}
              </div>
            </div>
          ) : (
            <div className="px-6 pt-10 sm:px-10 sm:pt-14"><h1 className="text-3xl font-black sm:text-5xl">{project.title}</h1></div>
          )}

          <div className="grid gap-8 bg-white p-6 sm:p-10 lg:grid-cols-[0.9fr_1.1fr] lg:gap-14">
            <div className="max-w-3xl">
              <span className="text-[10px] font-black tracking-[0.18em] text-[#688747]">{settings.detailSectionLabel || "تفاصيل المشروع"}</span>
              <p className="mt-4 whitespace-pre-line border-r-2 border-[#d2bb83] pr-5 text-base leading-8 text-[#657467] sm:text-lg sm:leading-9">{project.description || settings.detailFallbackDescription || "تفاصيل إضافية لهذا المشروع ستضاف قريبًا."}</p>
            </div>
            <div className="flex flex-col justify-between gap-5 border-t border-[#e5ece1] pt-5 sm:flex-row sm:items-center lg:border-r lg:border-t-0 lg:pr-8 lg:pt-0">
              <div>
                <h2 className="text-xl font-black">{settings.detailRelatedTitle || "هل لديك مشروع مشابه؟"}</h2>
                <p className="mt-2 text-sm text-[#68776b]">{settings.detailRelatedDescription || "اختر مجالًا أو تواصل معنا لمناقشة احتياجك."}</p>
              </div>
              <Link href="/contact" className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-[#173a31] px-5 text-sm font-black text-white transition hover:bg-[#2b5948]">{settings.detailCtaLabel || "ابدأ مشروعك"} <ArrowUpLeft size={16} /></Link>
            </div>
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}
