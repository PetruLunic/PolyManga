import en from './app/lib/locale/en.json';
import zodEn from './app/lib/locale/zod/en.json';

type Messages = typeof en & typeof zodEn;

declare global {
  // Use type safe message keys with `next-intl`
  interface IntlMessages extends Messages {}
}