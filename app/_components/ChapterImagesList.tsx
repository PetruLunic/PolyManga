"use client"

import ChapterImage from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/ChapterImage";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useSearchParams} from "next/navigation";
import {MultiLanguageImage} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_utils/transformChapter";
import {Button} from "@heroui/react";
import {Link} from "@/i18n/routing";

interface Props {
  images: MultiLanguageImage[];
}

export default function ChapterImagesList({ images }: Props) {
  const languageQuery = useSearchParams().get("language") ?? Object.keys(images[0])[0] as ChapterLanguage;

  return (
    <div className="flex flex-col items-center">
      {images.map((img, index) =>
        <ChapterImage key={index} image={img} languageQuery={languageQuery} priority={index <= 2} />
      )}
    </div>
  );
}