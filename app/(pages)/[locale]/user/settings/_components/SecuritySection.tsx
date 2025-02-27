"use client"

import InputPassword from "@/app/_components/InputPassword";
import {useForm} from "react-hook-form";
import {ChangePasswordSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";
import {Button} from "@heroui/react";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {changePassword} from "@/app/(pages)/[locale]/user/settings/actions";
import {zodResolver} from "@hookform/resolvers/zod";
import {useTranslations} from "next-intl";

export type FormType = z.infer<typeof ChangePasswordSchema>;

export default function SecuritySection() {
  const tForm = useTranslations("form");
  const tButton = useTranslations("common.ui.buttons");
  const tAlert = useTranslations("pages.user.settings.alerts");
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

      addAlert({message: tAlert("passwordChanged"), type: "success"});
    } catch (e) {
      console.error(e);

      if (e && typeof e === "object" && "message" in e && typeof e.message === "string") {
        addAlert({message: e.message, type: "danger"});
      } else {
        addAlert({message: tAlert("unexpectedError"), type: "danger"})
      }
    }
  })

 return (
  <form onSubmit={onSubmit} className="flex flex-col gap-3">
   <InputPassword
       isRequired
       autoFocus
       label={tForm("oldPassword")}
       placeholder={tForm("placeholders.oldPassword")}
       errorMessage={errors.oldPassword?.message}
       isInvalid={!!errors.oldPassword}
       {...register("oldPassword")}
   />
    <InputPassword
        isRequired
        label={tForm("newPassword")}
        placeholder={tForm("placeholders.newPassword")}
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
      {tButton("save")}
    </Button>
  </form>
 );
};