"use client"

import {useState} from "react";
import {createChapter} from "@/app/(pages)/[locale]/manga/[id]/upload/actions";
import {Button, Select, SelectItem} from "@heroui/react";
import {Input} from "@heroui/input";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {ChapterLanguageFull} from "@/app/types";
import {Divider} from "@heroui/divider";
import {nanoid} from "nanoid";
import {HiOutlinePlus} from "react-icons/hi";
import ImagesInputSection from "@/app/(pages)/[locale]/manga/[id]/upload/_components/ImagesInputSection";
import {useFieldArray, useForm} from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {EditChapterInputSchema} from "@/app/lib/utils/zodSchemas";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {ChapterInput} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/_components/EditChapterForm";

interface Props{
  slug: string;
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

const languagesMap: SelectItem[] = Object.keys(ChapterLanguage)
    .map((language ) => ({key: language as ChapterLanguage, value: ChapterLanguageFull[language as ChapterLanguage]}));

const languagesLimit = languagesMap.length;

interface FormData extends ChapterInput {
  images: ImageInputSection
}

export default function UploadChapterForm({slug, latestChapterNumber}: Props) {
  // Setting first input section default with first language, and empty images
  const [imageInputSections, setImageInputSections] =
    useState<ImageInputSection>({[nanoid()]: {language: ChapterLanguage.En, images: []}});
  const {
    register,
    handleSubmit,
    control,
    formState: {
      errors ,
      isSubmitting,
    },
    setError,
    clearErrors
  } = useForm<FormData>({
    resolver: zodResolver(EditChapterInputSchema),
    defaultValues: {
      titles: [{language: "En", value: `Chapter ${latestChapterNumber && latestChapterNumber + 1}`}],
      number: latestChapterNumber ? latestChapterNumber + 1 : 1,
      languages: "En"
    }
  });


  const { fields, append: appendTitle, remove: removeTitle } = useFieldArray({
    control,
    name: "titles",
  });
  const {addAlert} = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      clearErrors("root");

      // Create FormData object from the current form
      const formData = new FormData();

      for (let id in imageInputSections) {
        // Validate length of images
        if (imageInputSections[id].images.length === 0) {
          setError(`images.${id}`, {type: "custom", message: "In image input must be at least 1 image"})
          return;
        }

        // Validate unique language
        const repeatedLanguageSection = Object.entries(imageInputSections)
          .find(([currId, {language}]) => currId !== id && language === imageInputSections[id].language);
        if (repeatedLanguageSection) {
          setError(`images.${id}`, {type: "custom", message: `The language ${imageInputSections[id].language} is not unique`});
          setError(`images.${repeatedLanguageSection[0]}`, {type: "custom", message: `The language ${imageInputSections[id].language} is not unique`});
          return;
        }

        // Append images to formData
        for (let image of imageInputSections[id].images) {
          formData.append(`images-${imageInputSections[id].language}`, image);
        }
      }

      const input: ChapterInput = {
        ...data,
        mangaId: slug
      }

      const result = await createChapter(input, formData);

      if (!result.success) {
        addAlert({type: "danger", message: result.message});
        return;
      }

      addAlert({type: "success", message: "Chapter successfully uploaded"});
    } catch (e) {
      console.error(e);

      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
        addAlert({type: "danger", message: e.message});
      }
    }
  })

  return (
    <div className="flex flex-col gap-5 px-2">
      <form className="flex flex-col gap-6" onSubmit={onSubmit}>
        <div className="flex flex-col gap-3 md:flex-row">
          <Input
            label="Chapter number"
            type="number"
            placeholder="Enter chapter number"
            isInvalid={!!errors.number}
            errorMessage={errors.number?.message}
            {...register("number", {valueAsNumber: true})}
          />
          <Select
            isRequired
            label="Languages"
            disallowEmptySelection
            selectionMode="multiple"
            defaultSelectedKeys={["En"]}
            errorMessage={errors?.languages?.message}
            isInvalid={!!errors?.languages?.message}
            {...register(`languages`)}
          >
            {Object.keys(ChapterLanguage).map(lang =>
              <SelectItem key={lang}>{ChapterLanguageFull[lang as ChapterLanguage]}</SelectItem>
            )}
          </Select>
        </div>
        <div className="flex flex-col gap-3">
          <h2>
            Images
          </h2>
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
                      startContent={<HiOutlinePlus className="text-xl"/>}
                      color="primary"
                      onPress={() =>
                        setImageInputSections(prev => {
                          return {...prev, [nanoid()]: {language: languagesMap[0].key, images: []}}
                        })
                      }
                  >
                      Add section
                  </Button>
              </div>}
        </div>
        <h2>
          Titles
        </h2>
        <div className="flex flex-col gap-2">
          {fields.map((field, index) => (
            <div key={field.id} className="mb-4">
              <div className="flex gap-3 items-center">
                <Select
                  isRequired
                  label="Language"
                  className="w-[30%]"
                  defaultSelectedKeys={[field.language]}
                  errorMessage={errors?.titles?.[index]?.language?.message}
                  isInvalid={!!errors?.titles?.[index]?.language?.message}
                  {...register(`titles.${index}.language`)}
                >
                  {Object.keys(ChapterLanguage).map(lang =>
                    <SelectItem key={lang}>{ChapterLanguageFull[lang as ChapterLanguage]}</SelectItem>
                  )}
                </Select>
                <Input
                  isRequired
                  label="Title"
                  className="flex-1"
                  placeholder="Enter title"
                  {...register(`titles.${index}.value`)}
                  errorMessage={errors?.titles?.[index]?.value?.message}
                />
                {index > 0 && (
                  <Button
                    isIconOnly
                    color="danger"
                    onPress={() => removeTitle(index)}
                  >
                    ✕
                  </Button>
                )}
              </div>
            </div>))}
          <Divider />
          <Button
            startContent={<HiOutlinePlus className="text-xl"/>}
            className="self-end"
            color="primary"
            onPress={() => appendTitle({ language: '', value: '' })}
          >
            Add section
          </Button>
        </div>
        <Button className="w-12" type="submit" isLoading={isSubmitting}>Submit</Button>
      </form>
    </div>
  );
};

// export default function UploadChapterForm({slug, latestChapterNumber}: Props) {
//   // Setting first input section default with first language, and empty images
//   const [imageInputSections, setImageInputSections] =
//       useState<ImageInputSection>({[nanoid()]: {language: languagesMap[0].key, images: []}});
//   const formRef = useRef<HTMLFormElement | null>(null);
//   const {
//     register,
//     handleSubmit,
//     formState: {
//       errors ,
//       isSubmitting,
//       isSubmitSuccessful
//     },
//     setError,
//     clearErrors
//   } = useForm<FormData>({
//     resolver: zodResolver(ChapterInputSchema),
//   });
//
//   const onSubmit = handleSubmit(async () => {
//     try {
//       if (!formRef.current) return;
//       clearErrors("root");
//
//       // Create FormData object from the current form
//       const formData = new FormData(formRef.current);
//
//       // Append additional data to FormData
//       formData.append("slug", slug);
//
//       // Append images to formData
//       for (let id in imageInputSections) {
//
//         // Validate length of images
//         if (imageInputSections[id].images.length === 0) {
//           setError(`images.${id}`, {type: "custom", message: "In image input must be at least 1 image"})
//           return;
//         }
//
//         // Append title to form data
//         formData.append(`title-${imageInputSections[id].language}`, imageInputSections[id].title);
//
//         // Append images to form data
//         for (let image of imageInputSections[id].images) {
//           formData.append(`images-${imageInputSections[id].language}`, image);
//         }
//       }
//
//       // Getting array of chapter languages
//       const languages = Object.values(imageInputSections).map(({language}) => language);
//
//       // Every language should be unique. Invalidating it
//       if (new Set(languages).size !== languages.length) {
//         setError("root.languages", {type: "custom", message: "Languages must be unique"})
//         return;
//       }
//
//       // Call server action
//       const response = await createChapter(formData, languages);
//
//       if (!response?.success) {
//         setError("root.server", {type: "custom", message: response?.message})
//       }
//
//     } catch (e) {
//       console.error(e);
//       setError("root", {type: "custom", message: "Unexpected error"})
//     }
//   })
//
//   return (
//       <div className="flex flex-col gap-5 px-2">
//         <form ref={formRef} className="flex flex-col gap-3" onSubmit={onSubmit}>
//           <Alert
//               key={nanoid()}
//               title="Submit error"
//               description={errors.root && errors.root["languages"]?.message}
//               type="danger"
//               isVisible={!!(errors.root && errors.root["languages"])}
//               onDismiss={() => clearErrors("root.languages")}
//           />
//           <Alert
//               key={nanoid()}
//               title="Submit error"
//               description={errors.root && errors.root["server"]?.message}
//               type="danger"
//               isVisible={!!(errors.root && errors.root["server"])}
//               onDismiss={() => clearErrors("root.server")}
//           />
//           <Alert
//               key={nanoid()}
//               title="Chapter created successfully"
//               type="success"
//               isVisible={isSubmitSuccessful}
//           />
//           <div className="flex flex-col gap-3 md:flex-row">
//             <Input
//                 label="Chapter number"
//                 type="number"
//                 placeholder="Enter chapter number"
//                 isInvalid={!!errors.number}
//                 errorMessage={errors.number?.message}
//                 defaultValue={(latestChapterNumber ? latestChapterNumber + 1 : 1).toString()}
//                 {...register("number", {valueAsNumber: true})}
//             />
//           </div>
//           <div className="flex flex-col gap-3">
//             {Object.keys(imageInputSections).map((id) => {
//               const error = errors.images && errors.images[id];
//
//               return <ImagesInputSection
//                   key={id}
//                   id={id}
//                   setImageInputSections={setImageInputSections}
//                   imageInputSections={imageInputSections}
//                   languagesMap={languagesMap}
//                   errorMessage={error?.message}
//               />
//             }
//             )}
//             <Divider/>
//             {Object.keys(imageInputSections).length < languagesLimit &&
//               <div className="flex justify-end">
//                 <Button
//                     isIconOnly
//                     radius="full"
//                     onPress={() =>
//                         setImageInputSections(prev => {
//                           return {...prev, [nanoid()]: {language: languagesMap[0].key, images: [], title: ""}}
//                         })
//                     }
//                 >
//                     <HiOutlinePlus className="text-xl"/>
//                 </Button>
//               </div>}
//           </div>
//           <Button className="w-12" type="submit" isLoading={isSubmitting}>Submit</Button>
//         </form>
//       </div>
//   );
// };