"use client"

import {useRef, useState} from "react";
import {Button, SelectItem} from "@heroui/react";
import {Input} from "@heroui/input";
import {ChapterEditQuery, ChapterLanguage} from "@/app/__generated__/graphql";
import {ChapterLanguageFull} from "@/app/types";
import {Divider} from "@heroui/divider";
import {nanoid} from "nanoid";
import {HiOutlinePlus} from "react-icons/hi";
import ImagesInputSection from "@/app/(pages)/[locale]/manga/[id]/upload/_components/ImagesInputSection";
import z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {editChapter} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/actions";
import {useAlert} from "@/app/lib/contexts/AlertContext";

interface Props{
  chapter: ChapterEditQuery["chapter"]
}

export interface SelectItem {
  key: ChapterLanguage,
  value: ChapterLanguageFull
}

export interface ImageInputSection {
  [key: string]: {
    language: ChapterLanguage,
    title: string,
    images: File[]
  }
}

const ChapterInputSchema = z.object({
  number: z
      .number({required_error: "Chapter number is required", invalid_type_error: "Chapter number must be a number"})
      .int("Chapter number must be integer")
      .nonnegative("Chapter number must be positive")
})

const languagesMap: SelectItem[] = Object.keys(ChapterLanguage)
    .map((language ) => ({key: language as ChapterLanguage, value: ChapterLanguageFull[language as ChapterLanguage]}));

const languagesLimit = languagesMap.length;

type ChapterInputType = z.infer<typeof ChapterInputSchema>;

interface FormData extends ChapterInputType {
  images: ImageInputSection
}

export default function EditChapterForm({chapter}: Props) {
  // Setting first input section default with first language, and empty images
  const [imageInputSections, setImageInputSections] =
      useState<ImageInputSection>(
        chapter.versions.reduce((acc, version) =>
            ({...acc, [nanoid()]: {...version, images: []}}) // Filling the form with existing chapter data
        , {})
      );
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: {
      errors ,
      isSubmitting,
    },
    setError,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(ChapterInputSchema),
  });
  const {addAlert} = useAlert();

  const onSubmit = handleSubmit(async () => {
    try {
      if (!formRef.current) return;
      clearErrors("root");

      // Create FormData object from the current form
      const formData = new FormData(formRef.current);

      // Append additional data to FormData
      formData.append("mangaId", chapter.mangaId);
      formData.append("id", chapter.id);

      // Append images to formData
      for (let id in imageInputSections) {
        // Append title to form data
        formData.append(`title-${imageInputSections[id].language}`, imageInputSections[id].title);

        for (let image of imageInputSections[id].images) {
          formData.append(`images-${imageInputSections[id].language}`, image);
        }
      }

      // Getting array of chapter languages
      const languages = Object.values(imageInputSections).map(({language}) => language);

      // Every language should be unique. Invalidating it
      if (new Set(languages).size !== languages.length) {
        setError("root.languages", {type: "custom", message: "Languages must be unique"})
        return;
      }

      // Call server action
       await editChapter(formData, languages);

      addAlert({type: "success", message: "Chapter successfully updated"});
    } catch (e) {
      console.error(e);

      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
        addAlert({type: "danger", message: e.message});
      }
    }
  })

  return (
      <div className="flex flex-col gap-5 px-2">
        <form ref={formRef} className="flex flex-col gap-3" onSubmit={onSubmit}>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
                label="Chapter number"
                type="number"
                placeholder="Enter chapter number"
                isInvalid={!!errors.number}
                errorMessage={errors.number?.message}
                defaultValue={chapter.number.toString()}
                {...register("number", {valueAsNumber: true})}
            />
          </div>
          <div className="flex flex-col gap-3">
            {Object.keys(imageInputSections).map((id) =>
              <ImagesInputSection
                  key={id}
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
                        onPress={() =>
                            setImageInputSections(prev => {
                              return {...prev, [nanoid()]: {language: languagesMap[0].key, images: [], title: ""}}
                            })
                        }
                    >
                        <HiOutlinePlus className="text-xl"/>
                    </Button>
                </div>}
          </div>
          <Button className="w-12" type="submit" isLoading={isSubmitting}>Submit</Button>
        </form>
      </div>
  );
};