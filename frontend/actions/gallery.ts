'use server'

// ============================================================
// Gallery Server Actions
// ============================================================

import { assertSanityConfigured, client } from "../lib/sanity";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";
import { categories } from "../lib/brand";

export async function uploadGalleryBatch(formData: FormData): Promise<{ success: boolean; createdCount: number; error?: string }> {
  assertSanityConfigured();
  const category = (formData.get('category') as string) || 'fences';
  const files = (formData.getAll('images') as File[]).filter((file) => file.size > 0);

  if (!category || files.length === 0) {
    return { success: false, createdCount: 0, error: 'الرجاء اختيار القسم والصور.' };
  }

  const normalizedCategory = category === 'shabouk' ? 'fences' : category === 'nakheel' ? 'palms' : category;
  let createdCount = 0;

  try {
    for (const file of files) {
      const asset = await client.assets.upload('image', file, {
        filename: file.name,
      });
      await client.create({
        _type: 'gallery',
        category: normalizedCategory,
        image: {
          _type: 'image',
          asset: { _type: 'reference', _ref: asset._id }
        }
      });
      createdCount++;
    }

    revalidatePath('/admin/gallery');
    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath(`/projects/${normalizedCategory}`);
    return { success: true, createdCount };
  } catch (error) {
    console.error('Gallery Batch Upload Error:', error);
    return {
      success: createdCount > 0,
      createdCount,
      error: error instanceof Error ? error.message : 'حدث خطأ أثناء رفع بعض الصور.'
    };
  }
}

export async function uploadImages(formData: FormData) {
  assertSanityConfigured();
  const category = formData.get('category') as string;
  const files = formData.getAll('images') as File[];

  if (!category || files.length === 0) {
    throw new Error("الرجاء اختيار القسم والصور");
  }

  const normalizedCategory = category === 'shabouk' ? 'fences' : category === 'nakheel' ? 'palms' : category;
  const validFiles = files.filter((file) => file.size > 0);
  if (validFiles.length === 0) {
    redirect('/admin/gallery/new?error=files');
  }

  try {
    for (const file of validFiles) {
      const asset = await client.assets.upload('image', file, {
        filename: file.name,
      });
      await client.create({
        _type: 'gallery',
        category: normalizedCategory,
        image: {
          _type: 'image',
          asset: { _type: "reference", _ref: asset._id }
        }
      });
    }
    revalidatePath('/admin/gallery');
    revalidatePath('/');
    revalidatePath('/gallery');
    revalidatePath(`/projects/${normalizedCategory}`);
  } catch (error) {
    console.error("Gallery Upload Error:", error);
    redirect('/admin/gallery/new?error=upload');
  }

  redirect(`/admin/gallery?uploaded=${validFiles.length}`);
}

export async function deleteGalleryImage(id: string) {
  assertSanityConfigured();
  await client.delete(id);
  revalidatePath('/admin/gallery');
}
