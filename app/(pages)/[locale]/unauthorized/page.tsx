"use client"

import {Button} from "@heroui/react";
import {Link} from "@/i18n/routing";
import {useTranslations} from "next-intl";
import {useModal} from "@/app/lib/contexts/ModalsContext";

export default function UnauthorizedPage() {
  const t = useTranslations('pages.unauthorized');
  const {onOpen} = useModal("signIn");

  return (
    <div className="min-h-[calc(100vh-90px)] text-foreground flex items-center justify-center p-4 transition-colors">
      <div className="max-w-2xl text-center space-y-6">
        <div className="space-y-2">
          <h1 className="text-9xl font-black">402</h1>
          <h2 className="text-3xl font-bold">{t('title')}</h2>
          <p className="text-lg text-muted-foreground">{t('description')}</p>
        </div>

        <Button
          size="lg"
          color="primary"
          onPress={onOpen}
        >
          {t('signIn')}
        </Button>
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
