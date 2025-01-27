"use client"

import InputPassword from "@/app/_components/InputPassword";
import {useForm} from "react-hook-form";
import {ChangePasswordSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";
import {Button} from "@heroui/react";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {changePassword} from "@/app/(pages)/user/[id]/settings/actions";
import {zodResolver} from "@hookform/resolvers/zod";

export type FormType = z.infer<typeof ChangePasswordSchema>;

export default function SecuritySection() {
  const {
    handleSubmit,
    register,
    formState: {
      errors ,
      isSubmitting,
    }
  } = useForm<FormType>({
    resolver: zodResolver(ChangePasswordSchema)
  })
  const {addAlert} = useAlert();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changePassword(data);

      addAlert({message: "Password changed", type: "success"});
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
  <form onSubmit={onSubmit} className="flex flex-col gap-3">
   <InputPassword
       isRequired
       autoFocus
       label="Old password"
       placeholder="Enter your password"
       errorMessage={errors.oldPassword?.message}
       isInvalid={!!errors.oldPassword}
       {...register("oldPassword")}
   />
    <InputPassword
        isRequired
        label="New password"
        placeholder="Enter your new password"
        errorMessage={errors.newPassword?.message}
        isInvalid={!!errors.newPassword}
        {...register("newPassword")}
    />
    <Button
        className="self-start"
        color="primary"
        type="submit"
        isLoading={isSubmitting}
    >
      Save
    </Button>
  </form>
 );
};