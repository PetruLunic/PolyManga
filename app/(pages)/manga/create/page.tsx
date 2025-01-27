"use client"

import {useForm} from "react-hook-form";
import {Input, Textarea} from "@heroui/input";
import z from "zod";
import {MangaSchema} from "@/app/lib/utils/zodSchemas";
import {zodResolver} from "@hookform/resolvers/zod";
import {Button, Image, Select, SelectItem} from "@heroui/react";
import {ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/types";
import {useDropzone} from "react-dropzone";
import {CiImageOn} from "react-icons/ci";
import {createManga} from "@/app/(pages)/manga/create/actions";
import Alert from "@/app/_components/Alert";

export type FormType = z.infer<typeof MangaSchema>;

export default function Page() {
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors ,
      isSubmitting,
      isSubmitSuccessful
  }
  } = useForm<FormType>({
    resolver: zodResolver(MangaSchema)
  })
  const {acceptedFiles, getRootProps, getInputProps} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    }});

  const onSubmit = handleSubmit(async (data) => {
    try {
      // If no image was provided
      if (!acceptedFiles.length) {
        setError("root.image", {type: "custom", message: "Manga must have an image"});
        return;
      }

      // sending image to server action through formdata
      const formData = new FormData();
      formData.append("image", acceptedFiles[0]);

      await createManga(formData, data);
    } catch(e) {
        console.error(e);

        if (typeof e === "object" && e && "message" in e && typeof e.message === "string") {
          setError("root", {type: "custom", message: e.message});
        } else {
          setError("root", {type: "custom", message: "Unexpected error"});
        }

    }
  })

 return (
  <div>
   <h2 className="text-xl pb-3">Create Manga</h2>
    <form
        onSubmit={onSubmit}
      className="flex flex-col gap-3 pb-10"
    >
      <Alert title={"Submit error"} type="danger" isVisible={!!errors.root} description={errors.root?.message}/>
      <Alert title={"Manga created successfully"} type="success" isVisible={isSubmitSuccessful}/>
      <div className="flex flex-col gap-3 md:flex-row">
        <Input
            isRequired
            autoFocus
            label="Title"
            placeholder="Enter the title of the manga"
            errorMessage={errors.title?.message}
            isInvalid={!!errors.title}
            {...register("title")}
        />
        <Input
            isRequired
            label="Author"
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
            defaultSelectedKeys={[ComicsStatus.ONGOING]}
            disallowEmptySelection
            errorMessage={errors.status?.message}
            isInvalid={!!errors.status}
            {...register("status")}
        >
          {Object.keys(ComicsStatus).map(status =>
              <SelectItem key={status}>
                {status[0] + status.substring(1).toLowerCase()}
              </SelectItem>
          )}
        </Select>
        <Select
            isRequired
            label="Type"
            placeholder="Enter the type of the manga"
            errorMessage={errors.type?.message}
            defaultSelectedKeys={[ComicsType.manga]}
            disallowEmptySelection
            isInvalid={!!errors.type}
            {...register("type")}
        >
          {Object.keys(ComicsType).map(type =>
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
          isInvalid={!!errors.genres}
          {...register("genres")}
          classNames={{
            listboxWrapper: "max-h-[350px]"
          }}
      >
        {Object.keys(ComicsGenre).sort().map((type) =>
            <SelectItem key={type}>
              {type[0] + type.substring(1).toLowerCase().replace("_", " ")}
            </SelectItem>
        )}
      </Select>
      <div className="flex flex-col gap-3 md:flex-row items-center">
        <div {...getRootProps({className: 'dropzone w-48'})}>
          <input {...getInputProps()} />
          <div className={`flex flex-col w-48 border ${errors.root && errors.root["image"] ? "border-danger text-danger" : "border-gray-500 text-gray-400"}  border-dashed rounded-2xl ease-in duration-100 cursor-pointer hover:bg-gray-900/10`}>
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
          {errors.root && errors.root["image"] && <div className="text-tiny text-danger">{errors.root["image"].message}</div>}
        </div>
        <div className="flex flex-col gap-3 w-full">
          <Textarea
              isRequired
              label="Description"
              placeholder="Enter the description of the manga"
              errorMessage={errors.description?.message}
              isInvalid={!!errors.description}
              {...register("description")}
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
              errorMessage={errors.languages?.message}
              defaultSelectedKeys={["En"]}
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