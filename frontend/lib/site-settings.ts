import { cache } from "react";
import { BRAND_NAME } from "./brand";
import { safeFetchFresh } from "./sanity";
import type { SiteSettings } from "../types";

export async function getSiteName(): Promise<string> {
  const settings = await getPublicSiteSettings();
  return settings?.siteName?.trim() || BRAND_NAME;
}

export async function getSiteContact(): Promise<Pick<SiteSettings, "phone" | "whatsapp" | "email" | "address">> {
  const settings = await getPublicSiteSettings();
  return { phone: settings.phone, whatsapp: settings.whatsapp, email: settings.email, address: settings.address };
}

export const getPublicSiteSettings = cache(async (): Promise<SiteSettings> => {
  const settings = await safeFetchFresh<SiteSettings>(
    `*[_type == "settings"] | order(_updatedAt desc)[0]{
      siteName, description, heroTitle, heroSubTitle, heroDescription,
      introTitle, introDescription, fieldsTitle, fieldsDescription,
      benefitsTitle, benefitsDescription, projectsTitle, ctaTitle, ctaEyebrow, ctaDescription,
      aboutTitle, aboutSubTitle, aboutDescription, aboutHighlights,
      servicesTitle, servicesDescription, galleryTitle, galleryDescription,
      contactTitle, contactDescription, footerDescription, footerCtaLabel,
      footerTagline, footerDeveloperLabel, footerFieldsLabel, footerContactLabel,
      navHomeLabel, navAboutLabel, navServicesLabel, navGalleryLabel, navQuoteLabel,
      heroBadge, heroImageAlt, heroGalleryLabel, heroContactLabel, heroPerk1, heroPerk2, heroPerk3,
      introLabel, introFenceLabel, introPalmLabel, introLinkLabel, aboutImageAlt, aboutImageKicker, aboutImageTitle, fieldsLabel,
      fencesCardDescription, fencesCardTags, palmsCardDescription, palmsCardTags,
      benefitsLabel, benefit1Title, benefit1Description, benefit2Title, benefit2Description, benefit3Title, benefit3Description,
      projectsLabel, projectsLinkLabel, projectsEmptyText, projectContactLabel,
      aboutLabel, aboutStep1Title, aboutStep1Description, aboutStep2Title, aboutStep2Description, aboutStep3Title, aboutStep3Description, aboutContactLabel, aboutStepsLabel, aboutStepsTitle, aboutStepsHint,
      servicesLabel, fencesServiceStep1, fencesServiceStep2, fencesServiceStep3, palmsServiceStep1, palmsServiceStep2, palmsServiceStep3,
      galleryLabel, galleryEmptyTitle, galleryEmptyDescription, galleryCountLabel, galleryAllCategoriesLabel, galleryCardActionLabel, galleryImagesHeading, galleryContactPrompt,
      contactLabel, contactPanelTitle, contactPanelDescription, contactFencesLabel, contactPalmsLabel,
      contactWhatsAppLabel, contactPhoneLabel, contactEmailLabel, contactAddressLabel, contactMissingText,
      detailBackLabel, detailSectionLabel, detailFallbackDescription, detailRelatedTitle, detailRelatedDescription, detailCtaLabel, detailByline, detailDateLabel, fencesImageAlt, palmsImageAlt, theelImageAlt,
      fencesTitle, fencesEyebrow, fencesDescription, palmsTitle, palmsEyebrow, palmsDescription,
      theelTitle, theelEyebrow, theelDescription, theelCardDescription, theelCardTags,
      phone, whatsapp, email, address, facebook,
      "logoImageUrl": logo.asset->url,
      "heroImageUrl": heroImage.asset->url,
      "aboutImageUrl": aboutImage.asset->url,
      "categoryHomeImageUrls": categoryHomeImages{
        "fences": fences.asset->url, "palms": palms.asset->url, "theel": theel.asset->url
      }
    }`,
    {},
  );
  const result = settings ?? {};
  return {
    ...result,
    phone: result.phone?.trim() || "0502237446",
    whatsapp: result.whatsapp?.trim() || "0502237446",
  };
});
