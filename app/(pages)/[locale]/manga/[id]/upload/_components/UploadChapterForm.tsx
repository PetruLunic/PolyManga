"use client"

import {useRef, useState} from "react";
import {createChapter} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";
import {Button, SelectItem} from "@heroui/react";
import {Input} from "@heroui/input";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {ChapterLanguageFull} from "@/app/types";
import {Divider} from "@heroui/divider";
import {nanoid} from "nanoid";
import {HiOutlinePlus} from "react-icons/hi";
import ImagesInputSection from "@/app/(pages)/[locale]/manga/[id]/upload/_components/ImagesInputSection";
import z from "zod";
import {useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Alert from "@/app/_components/Alert";

interface Props{
  mangaId: string;
  latestChapterNumber?: number;
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

const ChapterInputSchema = z.object({
  number: z
      .number({required_error: "Chapter number is required", invalid_type_error: "Chapter number must be a number"})
      .nonnegative("Chapter number must be positive")
  ,
  title: z
      .string()
      .min(1, "Chapter title must be at least 1 character long")
      .max(50, "Chapter title must be maximum 50 characters long")
})

const languagesMap: SelectItem[] = Object.keys(ChapterLanguage)
    .map((language ) => ({key: language as ChapterLanguage, value: ChapterLanguageFull[language as ChapterLanguage]}));

const languagesLimit = languagesMap.length;

type ChapterInputType = z.infer<typeof ChapterInputSchema>;

interface FormData extends ChapterInputType {
  images: ImageInputSection
}

export default function UploadChapterForm({mangaId, latestChapterNumber}: Props) {
  // Setting first input section default with first language, and empty images
  const [imageInputSections, setImageInputSections] =
      useState<ImageInputSection>({[nanoid()]: {language: languagesMap[0].key, images: []}});
  const formRef = useRef<HTMLFormElement | null>(null);
  const {
    register,
    handleSubmit,
    formState: {
      errors ,
      isSubmitting,
      isSubmitSuccessful
    },
    setError,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(ChapterInputSchema),
  });

  const onSubmit = handleSubmit(async () => {
    try {
      if (!formRef.current) return;
      clearErrors("root");

      // Create FormData object from the current form
      const formData = new FormData(formRef.current);

      // Append additional data to FormData
      formData.append("mangaId", mangaId);

      // Append images to formData
      for (let id in imageInputSections) {

        // Validate length of images
        if (imageInputSections[id].images.length === 0) {
          setError(`images.${id}`, {type: "custom", message: "In image input must be at least 1 image"})
          return;
        }

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
      const response = await createChapter(formData, languages);

      if (!response?.success) {
        setError("root.server", {type: "custom", message: response?.message})
      }

    } catch (e) {
      console.error(e);
      setError("root", {type: "custom", message: "Unexpected error"})
    }
  })

  return (
      <div className="flex flex-col gap-5 px-2">
        <form ref={formRef} className="flex flex-col gap-3" onSubmit={onSubmit}>
          <Alert
              key={nanoid()}
              title="Submit error"
              description={errors.root && errors.root["languages"]?.message}
              type="danger"
              isVisible={!!(errors.root && errors.root["languages"])}
              onDismiss={() => clearErrors("root.languages")}
          />
          <Alert
              key={nanoid()}
              title="Submit error"
              description={errors.root && errors.root["server"]?.message}
              type="danger"
              isVisible={!!(errors.root && errors.root["server"])}
              onDismiss={() => clearErrors("root.server")}
          />
          <Alert
              key={nanoid()}
              title="Chapter created successfully"
              type="success"
              isVisible={isSubmitSuccessful}
          />
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
                label="Chapter title"
                type="text"
                placeholder="Enter chapter title"
                isInvalid={!!errors.title}
                errorMessage={errors.title?.message}
                defaultValue={`Chapter ${latestChapterNumber ? latestChapterNumber + 1 : ""}`}
                {...register("title")}
            />
            <Input
                label="Chapter number"
                type="number"
                placeholder="Enter chapter number"
                isInvalid={!!errors.number}
                errorMessage={errors.number?.message}
                defaultValue={(latestChapterNumber ? latestChapterNumber + 1 : 1).toString()}
                {...register("number", {valueAsNumber: true})}
            />
          </div>
          <div className="flex flex-col gap-3">
            {Object.keys(imageInputSections).map((id) => {
              const error = errors.images && errors.images[id];

              return <ImagesInputSection
                  key={id}
                  id={id}
                  setImageInputSections={setImageInputSections}
                  imageInputSections={imageInputSections}
                  languagesMap={languagesMap}
                  errorMessage={error?.message}
              />
            }
            )}
            <Divider/>
            {Object.keys(imageInputSections).length < languagesLimit &&
              <div className="flex justify-end">
                <Button
                    isIconOnly
                    radius="full"
                    onPress={() =>
                        setImageInputSections(prev => {
                          return {...prev, [nanoid()]: {language: languagesMap[0].key, images: []}}
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