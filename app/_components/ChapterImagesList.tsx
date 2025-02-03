"use client"

import ChapterImage from "@/app/(pages)/manga/[id]/[chapter]/_components/ChapterImage";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useSearchParams} from "next/navigation";
import {MultiLanguageImage} from "@/app/(pages)/manga/[id]/[chapter]/_utils/transformChapter";

interface Props {
  images: MultiLanguageImage[];
}

export default function ChapterImagesList({ images }: Props) {
  const languageQuery = useSearchParams().get("language") ?? Object.keys(images[0])[0] as ChapterLanguage;

  return (
    <div className="flex flex-col items-center">
      {images.map((img, index) =>
        <ChapterImage key={index} image={img} languageQuery={languageQuery} />
      )}
    </div>
  );
}