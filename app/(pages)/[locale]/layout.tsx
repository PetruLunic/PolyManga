import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "../../globals.css";
import Providers from "@/app/providers";
import NavbarRoot from "@/app/_components/navbar/NavbarRoot";
import {SessionProviderProps} from "next-auth/react";
import {seoMetaData} from "@/app/lib/seo/metadata";
import {NextIntlClientProvider} from "next-intl";
import {getMessages, setRequestLocale} from "next-intl/server";
import RefreshCheck from "@/app/_components/RefreshCheck";
import {setZodErrorMap} from "@/app/lib/utils/zodErrorMap";
import { SpeedInsights } from '@vercel/speed-insights/next';

const inter = Inter({ subsets: ["latin"] });

export async function generateMetadata({params}: Props): Promise<Metadata>  {
  const {locale} = await params;
  return await seoMetaData.default(locale);
}

interface Props {
  children: React.ReactNode;
  params: Promise<{
    session: SessionProviderProps["session"],
    locale: string
  }>
}

export default async function RootLayout({children, params}: Props) {
  const {session, locale} = await params;
  await setZodErrorMap(locale);
  const messages = await getMessages();
  setRequestLocale(locale);

  return (
    <html
      lang={locale}
      className="dark"
      style={{ colorScheme: 'dark' }}
    >
    <body
        className={inter.className + " before:bg-[url('/main-bg.avif')]" +
            " bg-black/50 min-h-screen before:bg-fixed before:bg-cover before:bg-no-repeat before:bg-center " +
            "before:bg-black/50 before:content-[''] before:h-full before:w-full before:block before:t-0 before:l-0 before:fixed before:z-[-1]"
        }>
    <NextIntlClientProvider locale={locale} messages={messages}>
      <Providers session={session}>
        <NavbarRoot/>
        <div className="z-40 w-full h-auto sticky top-0 inset-x-0" id="navbar-portal"></div>
        <main
          className="w-full max-w-[1024px] mx-auto mt-3"
        >
          {children}
        </main>
        {/*<RefreshCheck/>*/}
      </Providers>
    </NextIntlClientProvider>
    <SpeedInsights />
    </body>
    </html>
  );
}