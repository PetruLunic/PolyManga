import MangaPage from "@/app/(pages)/manga/MangaPage";
import {Suspense} from "react";
import {Spinner} from "@nextui-org/react";
import {Metadata} from "next";
import {seoMetaData} from "@/app/lib/seo/metadata";

export const metadata: Metadata = seoMetaData.manga;

export default async function Page() {

 return (
     <Suspense fallback={<Spinner/>}>
       <MangaPage/>
     </Suspense>
 );
};