import MangaPage from "@/app/(pages)/manga/MangaPage";
import {Suspense} from "react";
import {Spinner} from "@nextui-org/react";


export default async function Page() {

 return (
     <Suspense fallback={<Spinner/>}>
       <MangaPage/>
     </Suspense>
 );
};