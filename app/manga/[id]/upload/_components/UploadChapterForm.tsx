"use client"

import {useEffect, useRef, useState} from "react";
import {createChapter} from "@/app/manga/[id]/upload/actions";
import {Button, Select, SelectItem} from "@nextui-org/react";
import {Input} from "@nextui-org/input";
import {ChapterLanguage, ChapterLanguageFull} from "@/app/types";
import ImageInput from "@/app/manga/[id]/upload/_components/ImageInput";
import {Divider} from "@nextui-org/divider";
import {nanoid} from "nanoid";
import {HiOutlinePlus} from "react-icons/hi";
import {FaTrashAlt} from "react-icons/fa";
import ImagesInputSection from "@/app/manga/[id]/upload/_components/ImagesInputSection";

interface Props{
  mangaId: string;
}

export interface SelectItem {
  key: ChapterLanguage,
  value: ChapterLanguageFull
}

export interface ImageInputSection {
  [key: string]: {
    language: ChapterLanguage,
    images: File[]
  }
}

const languagesMap: SelectItem[] = Object.keys(ChapterLanguage)
    .map((language ) => ({key: language as ChapterLanguage, value: ChapterLanguageFull[language as ChapterLanguage]}));

const languagesLimit = languagesMap.length;

export default function UploadChapterForm({mangaId}: Props) {
  // Setting first input section default with first language, and empty images
  const [imageInputSections, setImageInputSections] =
      useState<ImageInputSection>({[nanoid()]: {language: languagesMap[0].key, images: []}});
  const formRef = useRef<HTMLFormElement | null>(null);

  console.log(imageInputSections);

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formRef.current) return;

    // Create FormData object from the current form
    const formData = new FormData(formRef.current);

    // Append additional data to FormData
    formData.append("mangaId", mangaId);

    // Append images to formData
    for (let id in imageInputSections) {
      for (let image of imageInputSections[id].images) {
        formData.append(`images-${imageInputSections[id].language}`, image);
      }
    }

    // Getting array of chapter languages
    const languages = Object.values(imageInputSections).map(({language}) => language);

    // Every language should be unique. Stop submitting if not
    if (new Set(languages).size !== languages.length) return;

    // Call server action
    await createChapter(formData, languages);
  }

  return (
      <div className="flex flex-col gap-5 px-2">
        <h2 className="text-xl">Create Chapter</h2>
        <form ref={formRef} className="flex flex-col gap-3" onSubmit={onSubmit} >
          <div className="flex flex-col gap-3 md:flex-row">
            <Input label="Chapter name" type="text" placeholder="Enter chapter name" name="chapterName" />
            <Input label="Chapter number" type="number" placeholder="Enter chapter number" name="chapterNumber" />
          </div>
          <div className="flex flex-col gap-3">
            {Object.keys(imageInputSections).map((id) =>
                <ImagesInputSection
                    id={id}
                    setImageInputSections={setImageInputSections}
                    imageInputSections={imageInputSections}
                    languagesMap={languagesMap}
                />
            )}
            <Divider/>
            {Object.keys(imageInputSections).length < languagesLimit &&
              <div className="flex justify-end">
                <Button
                    isIconOnly
                    radius="full"
                    onClick={() =>
                        setImageInputSections(prev => {
                          return {...prev, [nanoid()]: {language: languagesMap[0].key, images: []}}
                        })
                    }
                >
                    <HiOutlinePlus className="text-xl"/>
                </Button>
              </div>}
          </div>
          <SubmitButton/>
        </form>
      </div>
  );
};

function SubmitButton() {

  return <Button className="w-12" type="submit">Submit</Button>
}