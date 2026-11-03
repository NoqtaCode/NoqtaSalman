import Navbar from "./Navbar";
import { safeFetchFresh } from "../../lib/sanity";
import { getSiteName } from "../../lib/site-settings";

export default async function SiteNavbar({ overlay = false }: { overlay?: boolean }) {
  const [settings, siteName] = await Promise.all([
    safeFetchFresh<{ logoImageUrl?: string }>(
      `*[_type == "settings"][0]{"logoImageUrl": logo.asset->url}`,
      {},
    ),
    getSiteName(),
  ]);

  return <Navbar overlay={overlay} logoUrl={settings?.logoImageUrl} siteName={siteName} />;
}
