'use server'

// ============================================================
// Settings Server Actions
// ============================================================

import { client, getSanityWriteError } from "../lib/sanity";
import { revalidatePath } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

async function withRetry<T>(fn: () => Promise<T>, retries = 2, delayMs = 1200): Promise<T> {
  let lastError: unknown;
  for (let i = 0; i <= retries; i++) {
    try {
      return await fn();
    } catch (err: any) {
      lastError = err;
      const isNetwork = err?.isNetworkError || err?.code === 'UND_ERR_CONNECT_TIMEOUT' || err?.message?.includes('fetch failed') || err?.name === 'ConnectTimeoutError';
      if (i < retries && isNetwork) {
        await new Promise((res) => setTimeout(res, delayMs * (i + 1)));
        continue;
      }
      throw err;
    }
  }
  throw lastError;
}

export async function updateGeneralSettings(formData: FormData) {
  const configError = getSanityWriteError();
  if (configError) return { success: false, errorCode: configError };
  const fields = [
    'siteName', 'heroTitle', 'phone', 'whatsapp', 'email', 'address'
  ];
  const patchData: any = {};

  fields.forEach(field => {
    if (formData.has(field)) {
      const value = formData.get(field);
      patchData[field] = typeof value === "string" ? value.trim() : "";
    }
  });

  const heroFile = formData.get('heroImage') as File;
  const aboutFile = formData.get('aboutImage') as File;
  const logoFile = formData.get('logo') as File;

  try {
    const existingSettingsId: string | null = await withRetry(() => client.fetch(`*[_type == "settings"] | order(_updatedAt desc)[0]._id`, {}, { cache: "no-store" }));
    const settingsId = existingSettingsId || 'siteSettings';
    await withRetry(() => client.createIfNotExists({ _id: settingsId, _type: 'settings' }));
    let patch = client.patch(settingsId).set(patchData);

    const categorySlugs = ['fences', 'palms', 'theel'];
    for (const slug of categorySlugs) {
      const selectedAsset = formData.get(`categoryHomeImage_${slug}`);
      const rawCategoryFiles = formData.getAll(`categoryHomeUpload_${slug}`) as File[];
      const categoryFiles = rawCategoryFiles.filter((f) => f && f.size > 0 && typeof f.name === 'string');
      const path = `categoryHomeImages.${slug}`;

      if (categoryFiles.length > 0) {
        let firstAssetId: string | null = null;
        for (let i = 0; i < categoryFiles.length; i++) {
          const file = categoryFiles[i];
          validateImage(file);
          const asset = await withRetry(() => client.assets.upload('image', file, {
            filename: file.name,
          }));
          if (i === 0) {
            firstAssetId = asset._id;
          }

          // Save each uploaded image into the gallery under this category
          const categoryTitle = slug === 'palms' ? 'توريد وزراعة النخيل' : slug === 'theel' ? 'توريد وتركيب الثيل' : 'تركيب شبوك ومظلات';
          await withRetry(() => client.create({
            _type: 'gallery',
            title: categoryTitle,
            category: slug,
            image: {
              _type: 'image',
              asset: {
                _type: 'reference',
                _ref: asset._id,
              },
            },
          }));
        }

        if (firstAssetId) {
          patch = patch.set({ [path]: { _type: 'image', asset: { _type: 'reference', _ref: firstAssetId } } });
        }
      } else if (selectedAsset === '__auto__') {
        patch = patch.unset([path]);
      } else if (typeof selectedAsset === 'string' && selectedAsset.trim()) {
        patch = patch.set({ [path]: { _type: 'image', asset: { _type: 'reference', _ref: selectedAsset } } });
      }
    }

    if (logoFile && logoFile.size > 0) {
      validateImage(logoFile);
      const asset = await withRetry(() => client.assets.upload('image', logoFile));
      patch = patch.set({ logo: { _type: 'image', asset: { _type: "reference", _ref: asset._id } } });
    }

    if (heroFile && heroFile.size > 0) {
      validateImage(heroFile);
      const asset = await withRetry(() => client.assets.upload('image', heroFile));
      patch = patch.set({ heroImage: { _type: 'image', asset: { _type: "reference", _ref: asset._id } } });
    }

    if (aboutFile && aboutFile.size > 0) {
      validateImage(aboutFile);
      const asset = await withRetry(() => client.assets.upload('image', aboutFile));
      patch = patch.set({ aboutImage: { _type: 'image', asset: { _type: "reference", _ref: asset._id } } });
    }

    await withRetry(() => patch.commit());
    revalidatePath('/');
    revalidatePath('/', 'layout');
    revalidatePath('/about');
    revalidatePath('/services');
    revalidatePath('/gallery');
    revalidatePath('/contact');
    for (const slug of ['fences', 'palms', 'theel', 'shabouk', 'nakheel']) {
      revalidatePath(`/projects/${slug}`);
    }
    revalidatePath('/admin/settings');
    revalidatePath('/admin/gallery');
    return { success: true, message: "تم تحديث البيانات وحفظ الصور بنجاح" };
  } catch (error) {
    console.error("Failed to save general site settings:", error);
    const statusCode = (error as { statusCode?: number })?.statusCode;
    if (statusCode === 401) return { success: false, errorCode: "unauthorized" };
    if (statusCode === 403) return { success: false, errorCode: "forbidden" };
    if (error instanceof Error && error.message.includes("الصورة")) return { success: false, errorCode: "invalid-image" };
    return { success: false, errorCode: "save" };
  }
}

function validateImage(file: File) {
  const isImageMime = file.type.startsWith('image/');
  const isImageExt = /\.(jpe?g|png|webp|avif)$/i.test(file.name);
  if (!isImageMime && !isImageExt) {
    throw new Error('صيغة الصورة غير مدعومة. استخدم JPG أو PNG أو WebP.');
  }
  if (file.size > 25 * 1024 * 1024) {
    throw new Error('حجم الصورة يجب ألا يتجاوز 25 ميجابايت.');
  }
}

export async function updateAccountSettings(formData: FormData) {
  if (getSanityWriteError()) return { success: false, message: "تحقق من إعداد اتصال Sanity ورمز الكتابة في متغيرات بيئة الخادم." };
  const newUsername = formData.get('username') as string;
  const newPassword = formData.get('password') as string;
  const securityCode = formData.get('securityCode') as string;

  if (securityCode !== process.env.ADMIN_SECURITY_CODE) {
    return { success: false, message: "⚠️ كود الأمان غير صحيح! لا تملك صلاحية التغيير." };
  }

  if (!newUsername || !newPassword) {
    return { success: false, message: "يجب كتابة اسم المستخدم وكلمة المرور الجديدة" };
  }

  try {
    const existingSettingsId: string | null = await client.fetch(`*[_type == "settings"] | order(_updatedAt desc)[0]._id`, {}, { cache: "no-store" });
    const settingsId = existingSettingsId || 'siteSettings';
    await client.createIfNotExists({ _id: settingsId, _type: 'settings' });
    await client
      .patch(settingsId)
      .set({ username: newUsername, password: newPassword })
      .commit();

    const cookieStore = await cookies();
    cookieStore.delete('admin_session');
    
  } catch (error) {
    return { success: false, message: "فشل تحديث الحساب" };
  }

  redirect('/login');
}
