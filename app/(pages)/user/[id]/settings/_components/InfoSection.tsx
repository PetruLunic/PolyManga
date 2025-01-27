"use client"

import {Session} from "next-auth";
import {useForm, useWatch} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserInfoSchema} from "@/app/lib/utils/zodSchemas";
import {Input} from "@heroui/input";
import {useDropzone} from "react-dropzone";
import {Button, Image} from "@heroui/react";
import {CiImageOn} from "react-icons/ci";
import z from "zod";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {modifyUserInfo} from "@/app/(pages)/user/[id]/settings/actions";
import {useSession} from "next-auth/react";
import {USER_IMAGE_MAX_SIZE} from "@/app/lib/utils/constants";
import {useMemo} from "react";

interface Props{
  user: Session["user"]
}

export type FormType = z.infer<typeof UserInfoSchema>;

export default function InfoSection({user}: Props) {
  const {
    handleSubmit,
    control,
    register,
    formState: {
      errors ,
          isSubmitting,
    }
  } = useForm<FormType>({
    resolver: zodResolver(UserInfoSchema)
  });
  const {acceptedFiles, getRootProps, getInputProps, fileRejections} = useDropzone({
    accept: {
      'image/*': ['.jpeg', '.png', '.jpg']
    },
    maxFiles: 1,
    maxSize: USER_IMAGE_MAX_SIZE
  });
  const {addAlert} = useAlert();
  const {update, data: session} = useSession();
  const nameInput = useWatch({control, name: "name", defaultValue: user.name});
  const isTheSameInfo = useMemo(() => {
    return nameInput === session?.user.name && acceptedFiles.length === 0;
  }, [acceptedFiles, nameInput, session])

  const onSubmit = handleSubmit(async (data) => {
    try {
      if (acceptedFiles.length > 0) {
        const formData = new FormData();

        formData.append("image", acceptedFiles[0]);
        const response = await modifyUserInfo(data, formData);

        // Update the session info
        await update({user: {...session?.user, name: data.name, image: response.imageUrl}});
      } else {
        await modifyUserInfo(data);

        // Update the session info
        await update({user: {...session?.user, name: data.name}});
      }

      // If no error was thrown then it was successful
      addAlert({message: "User info updated", type: "success"});
    } catch (e) {
      console.error(e);

      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
        addAlert({message: e.message, type: "danger", delay: 10000});
      } else {
        addAlert({message: "Unexpected error", type: "danger"})
      }
    }
  })

 return (
  <form
    onSubmit={onSubmit}
    className="flex flex-col gap-3 "
  >
    <Input
      isRequired
      autoFocus
      label="Name"
      placeholder="Your name"
      errorMessage={errors.name?.message}
      defaultValue={user.name}
      isInvalid={!!errors.name}
        {...register("name")}
      />
    <Input
      isDisabled
      label="Email"
      placeholder="Your email"
      defaultValue={user.email}
      />
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
              <p className="font-bold">Profile image</p>
              <p>(Only *.jpeg, *.jpg and *.png images will be accepted)</p>
              <p>No larger than 1 MB</p>
            </div>}
      </div>
      {errors.root && errors.root["image"] && <div className="text-tiny text-danger">{errors.root["image"].message}</div>}
      {fileRejections.length !== 0 &&
          <ul>
            {fileRejections.map((file, index) =>
              <li key={index} className="text-tiny text-danger">
                {file.errors[0].message}
              </li>
              )}
          </ul>
      }
    </div>
    <Button
        className="self-start"
        color="primary"
        type="submit"
        isLoading={isSubmitting}
        isDisabled={!session || isTheSameInfo}
    >
      Save
    </Button>
  </form>
 );
};