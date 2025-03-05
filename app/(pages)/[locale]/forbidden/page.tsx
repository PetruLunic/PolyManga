import {Button} from "@heroui/react";
import {Link, locales} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";

export async function generateStaticParams() {
  return locales.map(locale => ({locale}));
}

export default async function ForbiddenPage() {
  const t = await getTranslations('pages.forbidden');

  return (
    <div className="min-h-[calc(100vh-90px)] text-foreground flex items-center justify-center p-4 transition-colors">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-black">403</h1>
          <h2 className="text-3xl font-bold">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <Link
          href="/"
          className="block"
        >
          <Button
            size="lg"
          >
            {t('returnHome')}
          </Button>
        </Link>
      </div>
    </div>
  )
}
