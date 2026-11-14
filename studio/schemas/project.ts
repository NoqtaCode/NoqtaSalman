import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'project',
  title: 'المشاريع',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'عنوان المشروع',
      type: 'string',
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'category',
      title: 'القسم (نوع العمل)',
      type: 'string',
      options: {
        list: [
          { title: 'الشبوك', value: 'fences' },
          { title: 'النخيل', value: 'palms' },
        ],
        layout: 'radio'
      },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'رابط الصفحة',
      type: 'slug',
      options: { source: 'title' },
      validation: (rule) => rule.required(),
    }),
    defineField({
      name: 'mainImage',
      title: 'الصورة الرئيسية',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'description',
      title: 'وصف العمل',
      type: 'text', 
      rows: 4,
    }),
    defineField({ name: 'date', title: 'تاريخ التنفيذ', type: 'date' }),
    defineField({
      name: 'status',
      title: 'حالة النشر',
      type: 'string',
      options: { list: [
        { title: 'منشور', value: 'published' },
        { title: 'مسودة', value: 'draft' },
      ] },
      initialValue: 'published',
    }),
  ],
})
