"use client";

import { useState } from "react";
import { createPortal } from "react-dom";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpLeft, Leaf, Menu } from "lucide-react";
import { categories, BRAND_NAME } from "../../lib/brand";
import type { SiteSettings } from "../../types";

export default function Navbar({ overlay = false, logoUrl, siteName = BRAND_NAME, settings = {} }: { overlay?: boolean; logoUrl?: string; siteName?: string; settings?: SiteSettings }) {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-6 sm:pt-5" dir="rtl">
      <nav className={`mx-auto flex max-w-[1360px] items-center justify-between gap-4 rounded-[1.25rem] border px-3 py-2.5 backdrop-blur-2xl transition-all duration-300 sm:rounded-[1.5rem] sm:px-5 ${overlay ? "border-white/20 bg-slate-950/45 shadow-[0_12px_40px_rgba(0,0,0,0.35)]" : "border-slate-200/80 bg-white/95 shadow-[0_10px_35px_rgba(13,35,27,0.06)]"}`}>
        <Link href="/" className="flex min-w-0 items-center gap-2 sm:gap-3 group" aria-label={siteName}>
          {logoUrl ? (
            <div className="relative h-12 w-28 sm:h-14 sm:w-36 md:h-16 md:w-44 shrink-0 transition-transform duration-300 group-hover:scale-105">
              <Image
                src={logoUrl}
                alt={`شعار ${siteName}`}
                fill
                unoptimized
                sizes="(max-width: 640px) 120px, 180px"
                className="object-contain object-right drop-shadow-[0_2px_8px_rgba(0,0,0,0.12)]"
                priority
              />
            </div>
          ) : (
            <span className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full sm:h-11 sm:w-11 transition-colors ${overlay ? "bg-white/15 text-[#e5b842]" : "bg-[#0d231b] text-[#dca842]"}`}>
              <Leaf size={20} strokeWidth={2} />
            </span>
          )}
          <span className={`truncate text-sm font-black sm:text-base md:text-lg transition-colors ${overlay ? "text-white drop-shadow-sm" : "text-[#0d231b]"}`}>
            {siteName}
          </span>
        </Link>

        <div className={`hidden items-center gap-7 text-[13px] font-bold lg:flex ${overlay ? "text-white/90" : "text-[#55695e]"}`}>
          <Link className={`transition ${overlay ? "hover:text-[#e5b842]" : "hover:text-[#0d231b]"}`} href="/#home">{settings.navHomeLabel || "الرئيسية"}</Link>
          <Link className={`transition ${overlay ? "hover:text-[#e5b842]" : "hover:text-[#0d231b]"}`} href="/about">{settings.navAboutLabel || "من نحن"}</Link>
          <Link className={`transition ${overlay ? "hover:text-[#e5b842]" : "hover:text-[#0d231b]"}`} href="/services">{settings.navServicesLabel || "الخدمات"}</Link>
          <Link className={`transition ${overlay ? "hover:text-[#e5b842]" : "hover:text-[#0d231b]"}`} href="/gallery">{settings.navGalleryLabel || "أعمالنا"}</Link>
        </div>

        <Link href="/contact" className="hidden min-h-11 items-center gap-2 rounded-full bg-gradient-to-r from-[#dca842] to-[#f0c868] px-6 text-xs font-black text-[#0d231b] shadow-[0_4px_18px_rgba(220,168,66,0.3)] transition-all duration-300 hover:brightness-110 hover:shadow-[0_6px_24px_rgba(220,168,66,0.5)] active:scale-95 lg:inline-flex">
          {settings.navQuoteLabel || "تواصل معنا"} <ArrowUpLeft size={15} />
        </Link>

        <button type="button" onClick={() => setMenuOpen((open) => !open)} className={`flex h-10 w-10 items-center justify-center rounded-full lg:hidden ${overlay ? "bg-white/15 text-white" : "bg-[#edf2e8] text-[#0d231b]"}`} aria-label={menuOpen ? "إغلاق القائمة" : "فتح القائمة"} aria-expanded={menuOpen} aria-controls="mobile-navigation">
          <Menu size={20} />
        </button>

        {menuOpen && createPortal(
          <div id="mobile-navigation" className="fixed inset-x-3 top-[4.5rem] z-[100] max-h-[calc(100dvh-5rem)] overflow-y-auto rounded-[1.5rem] border border-white bg-white/95 p-3 text-[#0d231b] shadow-[0_20px_60px_rgba(13,35,27,0.22)] backdrop-blur-xl sm:left-auto sm:right-6 sm:w-[min(calc(100vw-3rem),22rem)] lg:hidden">
            <Link href="/#home" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#edf2e8]">{settings.navHomeLabel || "الرئيسية"}</Link>
            <div className="grid grid-cols-3 gap-1.5 p-2">
              {categories.map((category) => <Link key={category.slug} href={`/projects/${category.slug}`} onClick={() => setMenuOpen(false)} className="rounded-xl bg-[#edf2e8] px-2 py-2.5 text-xs font-bold text-center">{category.slug === "fences" ? settings.fencesTitle || category.title : category.slug === "palms" ? settings.palmsTitle || category.title : settings.theelTitle || category.title}</Link>)}
            </div>
            <Link href="/about" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#edf2e8]">{settings.navAboutLabel || "من نحن"}</Link>
            <Link href="/gallery" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#edf2e8]">{settings.navGalleryLabel || "أعمالنا"}</Link>
            <Link href="/services" onClick={() => setMenuOpen(false)} className="block rounded-xl px-4 py-3 text-sm font-bold hover:bg-[#edf2e8]">{settings.navServicesLabel || "الخدمات"}</Link>
            <Link href="/contact" onClick={() => setMenuOpen(false)} className="mt-2 flex items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-[#dca842] to-[#c89532] px-4 py-3 text-sm font-black text-[#0d231b] shadow-md">{settings.navQuoteLabel || "تواصل معنا"} <ArrowUpLeft size={16} /></Link>
          </div>, document.body,
        )}
      </nav>
    </header>
  );
}
