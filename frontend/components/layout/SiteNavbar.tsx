import Navbar from "./Navbar";
import { getPublicSiteSettings } from "../../lib/site-settings";

export default async function SiteNavbar({ overlay = false }: { overlay?: boolean }) {
  const settings = await getPublicSiteSettings();

  return <Navbar overlay={overlay} logoUrl={settings.logoImageUrl} siteName={settings.siteName} settings={settings} />;
}
