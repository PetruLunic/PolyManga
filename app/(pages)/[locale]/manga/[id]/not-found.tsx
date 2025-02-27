import {Button} from "@heroui/react";
import {Link} from "@/i18n/routing";
import {getTranslations} from "next-intl/server";

export default async function ForbiddenPage() {
  const t = await getTranslations('pages.notfound');

  return (
    <div className="min-h-[calc(100vh-90px)] text-foreground flex items-center justify-center p-4 transition-colors">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-8xl font-bold">404</h1>
          <p className="text-xl">{t('messages.manga')}</p>
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
