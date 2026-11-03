import { BRAND_NAME } from "./brand";
import { safeFetchFresh } from "./sanity";

export async function getSiteName(): Promise<string> {
  const settings = await safeFetchFresh<{ siteName?: string }>(
    `*[_type == "settings"][0]{siteName}`,
    {},
  );

  return settings?.siteName?.trim() || BRAND_NAME;
}
