"use client"

import {Select, SelectItem} from "@nextui-org/react";
import {ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/__generated__/graphql";
import {useSearchParams} from "next/navigation";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useEffect} from "react";
import {isStringInEnum} from "@/app/lib/utils/isStringinEnum";

interface Props{

}

export default function FilterInputs({}: Props) {
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
        label="Genres"
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
            {type[0] + type.substring(1).toLowerCase().replace("_", " ")}
          </SelectItem>
      )}
    </Select>
    <Select
        label="Status"
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
            {status[0] + status.substring(1).toLowerCase()}
          </SelectItem>
      )}
    </Select>
    <Select
        label="Type"
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
            {type[0] + type.substring(1).toLowerCase()}
          </SelectItem>
      )}
    </Select>
    <Select
        label="Language"
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
            {language[0] + language.substring(1).toLowerCase()}
          </SelectItem>
      )}
    </Select>
  </div>
 );
};