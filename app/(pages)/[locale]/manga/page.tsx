import MangaPage from "@/app/(pages)/[locale]/manga/MangaPage";
import {Suspense} from "react";
import {Spinner} from "@heroui/react";
import {Metadata} from "next";
import {seoMetaData} from "@/app/lib/seo/metadata";

interface Props {
  params: Promise<{locale: string}>
}

export async function generateMetadata({params}: Props): Promise<Metadata>  {
  const {locale} = await params;
  return await seoMetaData.manga(locale);
}

export default async function Page() {

 return (
     <Suspense fallback={<Spinner/>}>
       <MangaPage/>
     </Suspense>
 );
};