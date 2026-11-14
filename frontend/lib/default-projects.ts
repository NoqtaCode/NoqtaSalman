export type ProjectItem = {
  _id: string;
  title: string;
  category: "fences" | "palms" | "theel";
  categoryLabel: string;
  slug: string;
  imageUrl: string;
  description: string;
  location?: string;
};

export const DEFAULT_CONTACT_PHONE = "0502237446";
export const DEFAULT_CONTACT_WHATSAPP = "0502237446";

export const defaultShowcaseProjects: ProjectItem[] = [
  // مشاريع الشبوك
  {
    _id: "fence-1",
    title: "تسوير مزارع ومخططات كبرى بالرياض",
    category: "fences",
    categoryLabel: "شبوك مزارع",
    slug: "fences",
    imageUrl: "https://images.unsplash.com/photo-1745100671491-ce4e0b638d24?auto=format&fit=crop&w=1200&q=85",
    description: "تركيب شبوك مجلفنة بمواصفات عالية مع صب قواعد خرسانية مسلحة وشدادات سلكية قوية.",
    location: "منطقة الرياض",
  },
  {
    _id: "fence-2",
    title: "سياج وشبوك أمنية للمستودعات والشركات",
    category: "fences",
    categoryLabel: "شبوك أمنية",
    slug: "fences",
    imageUrl: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=1200&q=85",
    description: "تسوير أمني متكامل مقاوم للاختراق مع تمديد أسلاك شائكة كونسرتينا حلزونية علوية.",
    location: "المناطق الصناعية",
  },
  {
    _id: "fence-3",
    title: "بوابات حديدية وشبوك محميات ومواشي",
    category: "fences",
    categoryLabel: "بوابات وشبوك",
    slug: "fences",
    imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=85",
    description: "تصنيع وتركيب بوابات سحب ومفصلية عالية المتانة وشبوك مرابط خيول ومحميات.",
    location: "مزارع وضواحي المملكة",
  },

  // مشاريع النخيل
  {
    _id: "palm-1",
    title: "توريد وغرس نخيل واشنطونيا للقصور والمشاريع",
    category: "palms",
    categoryLabel: "نخيل واشنطونيا",
    slug: "palms",
    imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85",
    description: "توريد وغرس نخيل زينة واشنطونيا بأطوال متناسقة لتجميل المداخل والواجهات الفارهة.",
    location: "قصور وفلل الرياض",
  },
  {
    _id: "palm-2",
    title: "مزارع نخيل التمور الفاخرة (خلاص وسكري)",
    category: "palms",
    categoryLabel: "نخيل تمور",
    slug: "palms",
    imageUrl: "https://images.unsplash.com/photo-1723482490939-528fc0d110fb?auto=format&fit=crop&w=1200&q=85",
    description: "غرس سلالات تمور أصيلة مفحوصة زراعياً وخالية من الآفات مع ضمان نجاح الغرس.",
    location: "مزارع الخرج والقصيم",
  },
  {
    _id: "palm-3",
    title: "قلع ونقل النخيل الكبير بالرافعات الهيدروليكية",
    category: "palms",
    categoryLabel: "قلع ونقل النخيل",
    slug: "palms",
    imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=85",
    description: "أسطول رافعات متخصص لنقل وقلع أشجار النخيل المعمر بنسبة نجاح تفوق 98%.",
    location: "كافة مدن المملكة",
  },

  // مشاريع الثيل
  {
    _id: "theel-1",
    title: "توريد وتركيب ثيل طبيعي للحدائق والفلل",
    category: "theel",
    categoryLabel: "ثيل طبيعي",
    slug: "theel",
    imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    description: "فرش ثيل طبيعي طازج C2000 وبسبالوم عالي الكثافة مع تأسيس شبكات الري الأوتوماتيكية.",
    location: "فلل وقصور الرياض",
  },
  {
    _id: "theel-2",
    title: "تركيب عشب وثيل صناعي للملاعب والاستراحات",
    category: "theel",
    categoryLabel: "ثيل صناعي",
    slug: "theel",
    imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1200&q=85",
    description: "عشب صناعي فائق الكثافة بسماكات متعددة مع مقاومة لأشعة الشمس وتصريف سريع لمياه الأمطار.",
    location: "ملاعب واستراحات المملكة",
  },
  {
    _id: "theel-3",
    title: "تنسيق مسطحات خضراء وشبكات ري ذكية",
    category: "theel",
    categoryLabel: "تنسيق مسطحات",
    slug: "theel",
    imageUrl: "https://images.unsplash.com/photo-1584467741285-95c5963f5091?auto=format&fit=crop&w=1200&q=85",
    description: "تسوية ودك التربة الخصبة وزراعة المسطحات مع ضبط رشاشات الري لتغطية متجانسة.",
    location: "منتجعات ومجمعات سكنية",
  },
];

export const defaultGalleryImages: Record<string, { _id: string; title: string; imageUrl: string }[]> = {
  fences: [
    {
      _id: "f-1",
      title: "تسوير مخططات ومزارع كبرى بالرياض",
      imageUrl: "https://images.unsplash.com/photo-1745100671491-ce4e0b638d24?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "f-2",
      title: "سياج وشبوك أمنية للمستودعات والكسارات",
      imageUrl: "https://images.unsplash.com/photo-1590856029826-c7a73142bbf1?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "f-3",
      title: "شبوك مجلفنة حماية ضد الصدأ والرياح",
      imageUrl: "https://images.unsplash.com/photo-1589939705384-5185137a7f0f?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "f-4",
      title: "بوابات سحب آلية ومفصلية لمداخل المزارع",
      imageUrl: "https://images.unsplash.com/photo-1621905251918-48416bd8575a?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "f-5",
      title: "تسوير أراضي زراعية وسياج أمني",
      imageUrl: "https://images.unsplash.com/photo-1533038590840-1cde6e668a91?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "f-6",
      title: "شبوك مزارع الخيول والمحميات الطبيعية",
      imageUrl: "https://images.unsplash.com/photo-1513836279014-a89f7a76ae86?auto=format&fit=crop&w=1200&q=85",
    },
  ],
  palms: [
    {
      _id: "p-1",
      title: "توريد وغرس نخيل واشنطونيا للقصور والمشاريع",
      imageUrl: "https://images.unsplash.com/photo-1509316975850-ff9c5deb0cd9?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "p-2",
      title: "صفوف نخيل تمور سكري وخلاص أصيل",
      imageUrl: "https://images.unsplash.com/photo-1723482490939-528fc0d110fb?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "p-3",
      title: "نخيل زينة للمنتجعات والمداخل الفارهة",
      imageUrl: "https://images.unsplash.com/photo-1542273917363-3b1817f69a2d?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "p-4",
      title: "قلع ونقل وغرس النخيل الكبير بالمعدات الثقيلة",
      imageUrl: "https://images.unsplash.com/photo-1508672019048-805c876b67e2?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "p-5",
      title: "تكريب وتنظيف نخيل دوري وتأسيس شبكات ري",
      imageUrl: "https://images.unsplash.com/photo-1516026672322-bc52d61a55d5?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "p-6",
      title: "سلالات نخيل تمور عربية أصيلة معتمدة",
      imageUrl: "https://images.unsplash.com/photo-1473448912268-2022ce9509d8?auto=format&fit=crop&w=1200&q=85",
    },
  ],
  theel: [
    {
      _id: "t-1",
      title: "توريد وفرش ثيل طبيعي C2000 للحدائق",
      imageUrl: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "t-2",
      title: "تركيب ثيل صناعي فاخر كثافة عالية للملاعب",
      imageUrl: "https://images.unsplash.com/photo-1592417817098-8f3d69109853?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "t-3",
      title: "تنسيق مسطحات خضراء للفلل والقصور",
      imageUrl: "https://images.unsplash.com/photo-1584467741285-95c5963f5091?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "t-4",
      title: "ثيل بسبالوم مقاوم للملوحة والحرارة",
      imageUrl: "https://images.unsplash.com/photo-1599818816942-e1c2d9e6e4a2?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "t-5",
      title: "تأسيس شبكات ري رشاشات أوتوماتيكية للثيل",
      imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da?auto=format&fit=crop&w=1200&q=85",
    },
    {
      _id: "t-6",
      title: "صيانة وتسميد وقص دوري للمسطحات الخضراء",
      imageUrl: "https://images.unsplash.com/photo-1516253593875-bd7ba052fbc5?auto=format&fit=crop&w=1200&q=85",
    },
  ],
};
