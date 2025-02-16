"use client"

import {useForm} from "react-hook-form";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";
import {resetPasswordAndSignIn} from "@/app/lib/userActions";
import React from "react";
import {Button} from "@heroui/react";
import InputPassword from "@/app/_components/InputPassword";
import {useTranslations} from "next-intl";
import {useRouter} from "@/i18n/routing";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSearchParams} from "next/navigation";
import {PasswordSchema} from "@/app/lib/utils/zodSchemas";

const ResetPasswordSchema = z.object({newPassword: PasswordSchema})

export default function Page() {
  const t = useTranslations("pages.resetPassword");
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const {addAlert} = useAlert();
  const {
    handleSubmit,
    register,
    formState: {
      errors ,
      isSubmitting,
    }
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema)
  });
  const router = useRouter();

  const onSubmit = handleSubmit(async data => {
    if (!token) {
      addAlert({message: t("invalidLink"), type: "danger"});
      return;
    }

    const response = await resetPasswordAndSignIn(data.newPassword, token);

    // If is successful close the modal and reload the page
    if (!response.success) {
      addAlert({message: response.message, type: "danger"});
    } else {
      addAlert({message: response.message, type: "success"});
      router.push({pathname: "/", query: {refresh: "true"}});
    }
  })

 return (
   <div className="mt-6 mx-2 flex flex-col gap-3 items-center">
     <h1 className="text-xl">{t('title')}</h1>
     <form onSubmit={onSubmit} className="flex flex-col gap-3 w-full max-w-96">
       <InputPassword
         label={t("newPassword")}
         placeholder={t("newPasswordPlaceholder")}
         errorMessage={errors.newPassword?.message}
         isInvalid={!!errors.newPassword}
         variant="bordered"
         {...register("newPassword")}
       />
       <Button color="primary" type="submit" isLoading={isSubmitting}>
         {t('submit')}
       </Button>
     </form>
   </div>
);
};