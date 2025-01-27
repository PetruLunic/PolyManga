"use client"

import {EditMangaInput, MangaEditQuery, ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/__generated__/graphql";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import {useDropzone} from "react-dropzone";
import Alert from "@/app/_components/Alert";
import {Input, Textarea} from "@heroui/input";
import {Button, Image, Select, SelectItem} from "@heroui/react";
import z from "zod";
import {editManga} from "@/app/(pages)/manga/[id]/edit/actions";

interface Props{
  manga: Exclude<MangaEditQuery["manga"], null | undefined>;
}

type EditMangaForm = z.infer<typeof MangaSchema>

export default function EditMangaForm({manga}: Props) {
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors ,
      isSubmitting,
      isSubmitSuccessful
    }
  } = useForm<EditMangaForm>({
    resolver: zodResolver(MangaSchema)
  })
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

      const mangaInput: EditMangaInput = {
        ...data,
        id: manga.id,
        image: manga.image,
        genres: data.genres.split(",") as ComicsGenre[],
        languages: data.languages.split(",") as ChapterLanguage[],
        type: data.type as ComicsType,
        status: data.status as ComicsStatus
      }
      await editManga(mangaInput, formData)
    } catch(e) {
      console.error(e);
      setError("root", {type: "custom", message: "Unexpected error"});
    }
  })

  return (
      <div>
        <h2 className="text-xl pb-3">Edit Manga</h2>
        <form
            onSubmit={onSubmit}
            className="flex flex-col gap-3 pb-10"
        >
          <Alert title={"Submit error"} type="danger" isVisible={!!errors.root} description={errors.root?.message}/>
          <Alert title={"Manga edited successfully"} type="success" isVisible={isSubmitSuccessful}/>
          <div className="flex flex-col gap-3 md:flex-row">
            <Input
                isRequired
                autoFocus
                label="Title"
                defaultValue={manga?.title}
                placeholder="Enter the title of the manga"
                errorMessage={errors.title?.message}
                isInvalid={!!errors.title}
                {...register("title")}
            />
            <Input
                isRequired
                label="Author"
                defaultValue={manga?.author}
                placeholder="Enter the author of the manga"
                errorMessage={errors.author?.message}
                isInvalid={!!errors.author}
                {...register("author")}
            />
          </div>
          <div className="flex flex-col gap-3 md:flex-row">
            <Select
                isRequired
                label="Status"
                placeholder="Enter the status of the manga"
                errorMessage={errors.status?.message}
                defaultSelectedKeys={[manga.status]}
                disallowEmptySelection
                isInvalid={!!errors.status}
                {...register("status")}
            >
              {Object.values(ComicsStatus).map(status =>
                  <SelectItem key={status}>
                    {status[0] + status.substring(1).toLowerCase()}
                  </SelectItem>
              )}
            </Select>
            <Select
                isRequired
                label="Type"
                placeholder="Enter the type of the manga"
                disallowEmptySelection
                defaultSelectedKeys={[manga.type]}
                errorMessage={errors.type?.message}
                isInvalid={!!errors.type}
                {...register("type")}
            >
              {Object.values(ComicsType).map(type =>
                  <SelectItem key={type}>
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
              disallowEmptySelection
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
              <div className={`flex flex-col w-48 h-64 border ${errors.root && errors.root["image"] ? "border-danger text-danger" : "border-gray-500 text-gray-400"}  border-dashed rounded-2xl ease-in duration-100 cursor-pointer hover:bg-gray-900/10`}>
                {acceptedFiles.length
                    ? <Image
                        src={URL.createObjectURL(acceptedFiles[0])}
                        style={{objectFit: "cover", width: "100%"}}
                        alt={`Image ${acceptedFiles[0].name}`}
                    />
                    : <Image
                          src={manga.image}
                          alt="Manga image"
                          style={{objectFit: "cover", width: "100%", height: "100%"}}
                      />}
              </div>
              {errors.root && errors.root["image"] && <div className="text-tiny text-danger">{errors.root["image"].message}</div>}
            </div>
            <div className="flex flex-col gap-3 w-full">
              <Textarea
                  isRequired
                  label="Description"
                  placeholder="Enter the description of the manga"
                  defaultValue={manga.description}
                  errorMessage={errors.description?.message}
                  isInvalid={!!errors.description}
                  {...register("description")}
              />
              <Input
                  isRequired
                  label="Release Year"
                  type="number"
                  placeholder="Enter the release year of the manga"
                  defaultValue={manga.releaseYear.toString()}
                  errorMessage={errors.releaseYear?.message}
                  isInvalid={!!errors.releaseYear}
                  {...register("releaseYear", {valueAsNumber: true})}
              />
              <Select
                  isRequired
                  label="Languages"
                  errorMessage={errors.languages?.message}
                  defaultSelectedKeys={manga.languages}
                  disallowEmptySelection
                  isInvalid={!!errors.languages}
                  selectionMode="multiple"
                  {...register("languages")}
              >
                {Object.keys(ChapterLanguage).map(language =>
                    <SelectItem key={language}>
                      {language}
                    </SelectItem>
                )}
              </Select>
            </div>
          </div>
          <Button isLoading={isSubmitting} className="self-end" type="submit">
            Submit
          </Button>
        </form>
      </div>
 );
};