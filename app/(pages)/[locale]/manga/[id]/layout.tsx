import {setRequestLocale} from "next-intl/server";

export async function generateStaticParams() {
  return [];
}

interface Props {
  params: Promise<{
    id: string,
    locale: string
  }>
  children: React.ReactNode
}

export default async function Layout({params, children}: Props) {
  const {locale} = await params;
  setRequestLocale(locale);

  return children;
};