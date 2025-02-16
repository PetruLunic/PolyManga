import { useTranslations } from 'next-intl';
import { z } from 'zod';
import {makeZodI18nMap} from "@/app/lib/utils/zodErrorMap";

export const useI18nZodErrors = () => {
  const t = useTranslations('zod');
  const tForm = useTranslations('form');
  const tCustom = useTranslations('form.customErrors');
  z.setErrorMap(makeZodI18nMap({ t, tForm, tCustom }));
};