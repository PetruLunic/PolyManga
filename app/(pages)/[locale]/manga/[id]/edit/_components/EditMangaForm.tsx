"use client"

import {
  ChapterLanguage,
  ComicsGenre,
  ComicsStatus,
  ComicsType,
  EditMangaInput,
  MangaEditQuery
} from "@/app/__generated__/graphql";
import {useFieldArray, useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import {useDropzone} from "react-dropzone";
import {Input, Textarea} from "@heroui/input";
import {Button, Image, Select, SelectItem, useDisclosure} from "@heroui/react";
import z from "zod";
import {editManga} from "@/app/(pages)/[locale]/manga/[id]/edit/actions";
import {CiImageOn} from "react-icons/ci";
import {useEffect} from "react";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {ChapterLanguageFull} from "@/app/types";
import TranslateMangaModal from "@/app/(pages)/[locale]/manga/[id]/edit/_components/TranslateMangaModal";

interface Props{
  manga: Exclude<MangaEditQuery["manga"], null | undefined>;
}

export type EditMangaForm = z.infer<typeof MangaSchema>

export default function EditMangaForm({manga}: Props) {
  const {addAlert} = useAlert();
  const {
    handleSubmit,
    register,
    setError,
    control,
    clearErrors,
    setValue,
    getValues,
    formState: {
      errors ,
      isSubmitting
    }
  } = useForm<EditMangaForm>({
    resolver: zodResolver(MangaSchema),
    defaultValues: {
      ...manga,
      genres: manga.genres.join(","),
      languages: manga.languages.join(","),
      scrapSources: manga.scrapSources?.asurascans ?? undefined
    }
  })
  const disclosure = useDisclosure();

  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }});

  const onSubmit = handleSubmit(async (data) => {
    try {
      // sending image to server action through formdata
      let formData: FormData | undefined;

      if (acceptedFiles[0]) {
        formData = new FormData();
        formData.append("image", acceptedFiles[0]);
      }

      const descriptions = data.descriptions.map(({language, value}) => ({value, language: language as ChapterLanguage}));
      const titles = data.titles.map(({language, value}) => ({value, language: language as ChapterLanguage}))

      const mangaInput: EditMangaInput = {
        ...data,
        slug: manga.slug,
        descriptions,
        titles,
        id: manga.id,
        image: manga.image,
        genres: data.genres.split(",") as ComicsGenre[],
        languages: data.languages.split(",") as ChapterLanguage[],
        type: data.type as ComicsType,
        status: data.status as ComicsStatus,
        scrapSources: {
          asurascans: data.scrapSources
        }
      }
      await editManga(mangaInput, formData);

      addAlert({type: "success", message: "Manga successfully edited!"});
    } catch(e) {
      console.error(e);
      setError("root", {type: "custom", message: "Unexpected error"});
    }
  })

  const { fields, append: appendTitle, remove: removeTitle } = useFieldArray({
    control,
    name: "titles",
  });

  const { append: appendDescription, remove: removeDescription } = useFieldArray({
    control,
    name: "descriptions"
  });

  // Add new language fields (both title and description)
  const addLanguageFields = () => {
    appendTitle({ language: '', value: '' });
    appendDescription({ language: '', value: '' });
  };

  const removeLanguageFields = (index: number) => {
    removeTitle(index);
    removeDescription(index);
  }

  useEffect(() => {
    if (!errors["root"]?.message) return;

    addAlert({type: "danger", message: errors["root"]?.message})
  }, [errors["root"]?.message]);

  const validateUniqueLanguage = (value: string, index: number) => {
    clearErrors(`titles`)
    const titles = getValues('titles');
    const isDuplicate = titles.some(
      (item, i) => i !== index && item.language === value
    );

    if (isDuplicate) {
      setError(`titles.${index}.language`, {type: "validate", message: "This language is already selected"})
    }
  };

  return (
    <>
      <h2 className="text-xl pb-3">Edit {manga.titles[0].value}</h2>
      <form
        onSubmit={onSubmit}
        className="flex flex-col gap-3 pb-10"
      >
        <div className="flex flex-col gap-3 md:flex-row">
          <Select
            isRequired
            label="Status"
            placeholder="Enter the status of the manga"
            disallowEmptySelection
            errorMessage={errors.status?.message}
            isInvalid={!!errors.status}
            {...register("status")}
          >
            {Object.keys(ComicsStatus).map(status =>
              <SelectItem key={status.toUpperCase()}>
                {status[0] + status.substring(1).toLowerCase()}
              </SelectItem>
            )}
          </Select>
          <Select
            isRequired
            label="Type"
            placeholder="Enter the type of the manga"
            errorMessage={errors.type?.message}
            disallowEmptySelection
            isInvalid={!!errors.type}
            {...register("type")}
          >
            {Object.keys(ComicsType).map(type =>
              <SelectItem key={type.toLowerCase()}>
                {type[0] + type.substring(1).toLowerCase()}
              </SelectItem>
            )}
          </Select>
        </div>
        <Select
          isRequired
          label="Genres"
          placeholder="Enter the genres of the manga"
          errorMessage={errors.genres?.message}
          selectionMode="multiple"
          isInvalid={!!errors.genres}
          defaultSelectedKeys={manga.genres}
          {...register("genres")}
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
        <div className="flex flex-col gap-3 md:flex-row items-center">
          <div {...getRootProps({className: 'dropzone w-48'})}>
            <input {...getInputProps()} />
            <div
              className={`flex flex-col w-48 border ${errors.root && errors.root["image"] ? "border-danger text-danger" : "border-gray-500 text-gray-400"}  border-dashed rounded-2xl ease-in duration-100 cursor-pointer hover:bg-gray-900/10`}>
              {acceptedFiles.length
                ? <Image
                  src={URL.createObjectURL(acceptedFiles[0])}
                  style={{objectFit: "cover", width: "100%"}}
                  alt={`Image ${acceptedFiles[0].name}`}
                />
                : <div className="flex flex-col items-center justify-center py-10 text-center">
                  <CiImageOn className="text-3xl"/>
                  <p className="font-bold">Manga image</p>
                  <p>(Only *.jpeg, *.jpg and *.png images will be accepted)</p>
                </div>}
            </div>
            {errors.root && errors.root["image"] &&
                <div className="text-tiny text-danger">{errors.root["image"].message}</div>}
          </div>
          <div className="flex flex-col gap-3 w-full">
            <Input
              isRequired
              label="Author"
              placeholder="Enter the author of the manga"
              errorMessage={errors.author?.message}
              isInvalid={!!errors.author}
              {...register("author")}
            />
            <Input
              isRequired
              label="Release Year"
              type="number"
              placeholder="Enter the release year of the manga"
              errorMessage={errors.releaseYear?.message}
              isInvalid={!!errors.releaseYear}
              {...register("releaseYear", {valueAsNumber: true})}
            />
            <Select
              isRequired
              label="Languages"
              disallowEmptySelection
              selectionMode="multiple"
              defaultSelectedKeys={manga.languages}
              errorMessage={errors?.languages?.message}
              isInvalid={!!errors?.languages?.message}
              {...register(`languages`)}
            >
              {Object.keys(ChapterLanguage).map(lang =>
                <SelectItem key={lang}>{ChapterLanguageFull[lang as ChapterLanguage]}</SelectItem>
              )}
            </Select>
            <Input
              label="Scrap URL"
              errorMessage={errors.scrapSources?.message}
              isInvalid={!!errors.scrapSources}
              {...register("scrapSources")}
            />
          </div>
        </div>
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg">Translations</h3>
          <Button
            onPress={disclosure.onOpen}
          >
            Translate
          </Button>
        </div>
        {fields.map((field, index) => (
          <div key={field.id} className="mb-4">
            <div className="flex gap-3 mb-3 items-center">
              <Select
                isRequired
                label="Language"
                className="w-[30%]"
                defaultSelectedKeys={[field.language]}
                errorMessage={errors?.titles?.[index]?.language?.message}
                isInvalid={!!errors?.titles?.[index]?.language?.message}
                {...register(`titles.${index}.language`,)}
                onChange={(e) => {
                  // Register the same language for both title and description
                  const value = e.target.value;
                  setValue(`titles.${index}.language`, value);
                  setValue(`descriptions.${index}.language`, value);

                  // Validate if the language is already selected
                  validateUniqueLanguage(value, index);
                }}
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
                  onPress={() => removeLanguageFields(index)}
                >
                  ✕
                </Button>
              )}
            </div>
            <Textarea
              isRequired
              label="Description"
              className="w-full"
              placeholder="Enter description"
              {...register(`descriptions.${index}.value`)}
              errorMessage={errors?.descriptions?.[index]?.value?.message}
            />
          </div>
        ))}
        <Button
          className="self-end"
          onPress={addLanguageFields}
        >
          Add Language
        </Button>
        <Button isLoading={isSubmitting} className="self-start" type="submit">
          Submit
        </Button>
      </form>
      <TranslateMangaModal setValue={setValue} manga={manga} {...disclosure} />
    </>
  );
};