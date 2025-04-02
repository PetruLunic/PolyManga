import {getRequestConfig, setRequestLocale} from 'next-intl/server';
import {routing} from './routing';

export default getRequestConfig(async ({requestLocale}) => {
  // This typically corresponds to the `[locale]` segment
  let locale = await requestLocale;

  // Ensure that a valid locale is used
  if (!locale || !routing.locales.includes(locale as any)) {
    locale = routing.defaultLocale;
  }

  setRequestLocale(locale); // for pages static generation

  return {
    locale,
    messages: {
      ...(await import(`../app/lib/locale/${locale}.json`)).default,
      ...(await import(`../app/lib/locale/zod/${locale}.json`)).default

    },
  };
});