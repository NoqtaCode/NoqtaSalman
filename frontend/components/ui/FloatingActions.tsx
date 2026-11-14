'use client';

import { MessageCircle, PhoneCall } from "lucide-react";

export default function FloatingActions({ phone, whatsapp }: { phone?: string; whatsapp?: string }) {
  const cleanPhone = phone?.replace(/[^\d+]/g, "") || "0502237446";
  const rawWhatsapp = (whatsapp || cleanPhone || "0502237446").replace(/\D/g, "");
  const waNumber = rawWhatsapp.startsWith("05")
    ? `966${rawWhatsapp.slice(1)}`
    : rawWhatsapp.startsWith("5")
    ? `966${rawWhatsapp}`
    : rawWhatsapp;

  const whatsappHref = `https://wa.me/${waNumber}?text=${encodeURIComponent("السلام عليكم ورحمة الله، أود الاستفسار عن خدماتكم (شبوك، نخيل، ثيل)")}`;
  const phoneHref = `tel:${cleanPhone}`;

  return (
    <aside aria-label="أزرار التواصل السريع" className="fixed bottom-6 left-6 z-[999] flex flex-col gap-3.5 items-center">
      
      {/* زر الاتصال الهاتفي */}
      <a 
        href={phoneHref}
        aria-label="اتصال هاتفي مباشر"
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-gradient-to-br from-[#0d231b] to-[#1b4332] text-[#e5b842] shadow-[0_10px_25px_rgba(13,35,27,0.4)] border border-[#e5b842]/40 transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_30px_rgba(229,184,66,0.35)] active:scale-95"
      >
        <PhoneCall size={24} className="sm:w-7 sm:h-7 transition-transform group-hover:rotate-12" />
        
        {/* تلميح اسم الزر */}
        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition-opacity group-hover:block">
          اتصال مباشر
        </span>
      </a>

      {/* زر الواتساب مع تأثير النبض */}
      <a 
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="محادثة واتساب سريعة"
        className="group relative flex h-14 w-14 sm:h-16 sm:w-16 items-center justify-center rounded-full bg-[#25D366] text-white shadow-[0_10px_25px_rgba(37,211,102,0.45)] border border-white/30 transition-all duration-300 hover:scale-110 hover:shadow-[0_15px_35px_rgba(37,211,102,0.6)] active:scale-95"
      >
        {/* نبض خلفي لجذب الانتباه */}
        <span className="absolute inset-0 rounded-full bg-[#25D366] opacity-75 animate-ping pointer-events-none -z-10" />

        <MessageCircle size={28} className="sm:w-8 sm:h-8 transition-transform group-hover:scale-110" />
        
        {/* تلميح اسم الزر */}
        <span className="pointer-events-none absolute left-full ml-3 hidden whitespace-nowrap rounded-xl bg-slate-900/90 px-3 py-1.5 text-xs font-bold text-white shadow-md backdrop-blur-md transition-opacity group-hover:block">
          محادثة واتساب
        </span>
      </a>

    </aside>
  );
}
