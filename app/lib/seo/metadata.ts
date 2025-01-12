import {Metadata} from "next";

export const domain = process.env.NEXT_PUBLIC_SITE_URL;
export const type = 'website';
export const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME;

export const seoMetaData: Readonly<{ [key: string]: Metadata }> = {
  manga: {
    title: `Read free multi-language manga | ${siteName}`,
    description: "Read high-quality manga chapters for free in multiple languages.",
    keywords: `manga, read manga, read manhwa, read manhua, best manga, free manga, read manga online, popular manga`,

    openGraph: {
      title: "Read free multi-language manga",
      description: "Read high-quality manga chapters for free in multiple languages.",
      type,
      url: `${domain}/manga`
    }
  }
} as const