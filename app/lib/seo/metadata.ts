import {Metadata} from "next";
import {getTranslations} from "next-intl/server";

export const domain = process.env.NEXT_PUBLIC_SITE_URL;
export const type = 'website';
export const siteName = process.env.NEXT_PUBLIC_PROJECT_NAME;

export const seoMetaData: Readonly<{ [key: string]: (locale: string) => Promise<Metadata> }> = {
  default: async (locale: string) => {
    const t = await getTranslations({ locale, namespace: 'pages.manga.metadata' })

    return {
      title: siteName,
      description: t('description'),
      keywords: t('keywords'),
      openGraph: {
        title: t("openGraph.title"),
        description: t("openGraph.description"),
        type,
        url: `${domain}/${locale}`
      }
    }
  },
  manga: async (locale: string) => {
    const t = await getTranslations({ locale, namespace: 'pages.manga.metadata' })

    return {
      title: t('title', { siteName }),
      description: t('description'),
      keywords: t('keywords'),
      openGraph: {
        title: t("openGraph.title"),
        description: t("openGraph.description"),
        type,
        url: `${domain}/${locale}/manga`
      }
    }
  }
} as const