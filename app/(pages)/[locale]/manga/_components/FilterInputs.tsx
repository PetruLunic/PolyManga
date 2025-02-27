"use client"

import {Select, SelectItem} from "@heroui/react";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";
import {useTranslations} from "next-intl";
import {ChapterLanguage, ChapterLanguageFull, ComicsGenre, ComicsStatus, ComicsType} from "@/app/types";

interface Props{

}

export default function FilterInputs({}: Props) {
  const mangaT = useTranslations("common.manga");
  const placeholdersT = useTranslations("pages.manga.placeholders");
  const searchParams = useSearchParams();
  const statuses = searchParams.getAll("status");
  const genres = searchParams.getAll("genre");
  const types = searchParams.getAll("type");
  const languages = searchParams.getAll("language");
  const {replaceParam, deleteParam} = useQueryParams();

  // Validating query params
  useEffect(() => {
    // Validate genres
    genres.forEach(genre => {
      if (!isStringInEnum(genre, ComicsGenre)) {
        deleteParam("genre", genre);
      }
    })

    // Validate statuses
    statuses.forEach(status => {
      if (!isStringInEnum(status, ComicsStatus)) {
        deleteParam("status", status);
      }
    })

    // Validate types
    types.forEach(type => {
      if (!isStringInEnum(type, ComicsType)) {
        deleteParam("type", type);
      }
    })

    // Validate languages
    languages.forEach(language => {
      if (!isStringInEnum(language, ChapterLanguage)) {
        deleteParam("language", language)
      }
    })
  }, [genres, statuses, types, deleteParam, languages]);

 return (
  <div className="flex flex-col gap-3">
    <Select
        label={placeholdersT("genres")}
        selectionMode="multiple"
        selectedKeys={genres}
        onSelectionChange={value => {
          if (value === "all") return;
          const keys = Array.from(value.keys());
          replaceParam({"genre": keys as string[]});
        }}
        classNames={{
          listboxWrapper: "max-h-[350px]"
        }}
    >
      {Object.values(ComicsGenre).sort().map((type) =>
          <SelectItem key={type}>
            {mangaT(`genres.${type.toLowerCase()}`)}
          </SelectItem>
      )}
    </Select>
    <Select
        label={placeholdersT("status")}
        selectionMode="multiple"
        selectedKeys={statuses}
        onSelectionChange={value => {
          if (value === "all") return;
          const keys = Array.from(value.keys());
          replaceParam({"status": keys as string[]});
        }}
    >
      {Object.values(ComicsStatus).map(status =>
          <SelectItem key={status}>
            {mangaT(`status.${status}`)}
          </SelectItem>
      )}
    </Select>
    <Select
        label={placeholdersT("type")}
        selectedKeys={types}
        selectionMode="multiple"
        onSelectionChange={value => {
          if (value === "all") return;
          const keys = Array.from(value.keys());
          replaceParam({"type": keys as string[]});
        }}
    >
      {Object.values(ComicsType).map(type =>
          <SelectItem key={type}>
            {mangaT(`type.${type}`)}
          </SelectItem>
      )}
    </Select>
    <Select
        label={placeholdersT("language")}
        selectedKeys={languages}
        selectionMode="multiple"
        onSelectionChange={value => {
          if (value === "all") return;
          const keys = Array.from(value.keys());
          replaceParam({"language": keys as string[]});
        }}
    >
      {Object.values(ChapterLanguage).map(language =>
          <SelectItem key={language}>
            {ChapterLanguageFull[language]}
          </SelectItem>
      )}
    </Select>
  </div>
 );
};