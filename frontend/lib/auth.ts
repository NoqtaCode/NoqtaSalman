'use server'

// ============================================================
// Auth Server Actions (login / logout)
// ============================================================

import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { client, isSanityConfigured } from "./sanity";

export async function login(formData: FormData) {
  if (!isSanityConfigured) return { success: false };

  const inputUsername = formData.get('username') as string;
  const inputPassword = formData.get('password') as string;

  let settings: { username?: string; password?: string } | null = null;
  try {
    // جلب بيانات الدخول المخزنة في إعدادات قاعدة البيانات
    settings = await client.withConfig({ timeout: 5000, maxRetries: 0 }).fetch(`*[_type == "settings"][0]{username, password}`);
  } catch (error) {
    // إذا تعذّر الاتصال بـSanity، تبقى بيانات البيئة خيار الدخول الاحتياطي.
    console.error("Could not read admin credentials from Sanity; using environment fallback:", error);
  }

  // إعدادات Sanity تتقدم عند وجودها، وإلا نستخدم بيانات البيئة.
  const validUsername = settings?.username?.trim() || process.env.ADMIN_USER?.trim();
  const validPassword = settings?.password || process.env.ADMIN_PASS;

  if (validUsername && validPassword && inputPassword === validPassword && inputUsername.trim() === validUsername) {
    const cookieStore = await cookies();

    cookieStore.set('admin_session', 'true', {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      maxAge: 60 * 60 * 24 * 7, // أسبوع واحد
      path: '/',
    });

    return { success: true };
  }
  
  return { success: false };
}

export async function logout() {
  const cookieStore = await cookies();
  cookieStore.delete('admin_session');
  redirect('/login');
}
