"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserPreferencesSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";
import {Session} from "next-auth";
import {Button, Select, SelectItem} from "@heroui/react";
import {ChapterLanguageFull} from "@/app/types";
import {changeUserPreferences} from "@/app/(pages)/[locale]/user/settings/actions";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {ChapterLanguage} from "@/app/__generated__/graphql";
import {useTranslations} from "next-intl";

interface Props{
  user: Session["user"]
}

export type FormType = z.infer<typeof UserPreferencesSchema>;

export default function PreferencesSection({user}: Props) {
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
    resolver: zodResolver(UserPreferencesSchema)
  });
  const {addAlert} = useAlert();
  const {update, data: session} = useSession();

  const onSubmit = handleSubmit(async (data) => {
    try {
      await changeUserPreferences(data);
      await update({user: {...session?.user, preferences: {
        sourceLanguage: data.sourceLanguage.toLowerCase(),
        targetLanguage: data.targetLanguage.toLowerCase()
      }}});
      addAlert({message: tAlert("preferencesChanged"), type: "success"});
    } catch(e) {
      console.error(e);
      addAlert({message: tAlert("unexpectedError"), type: "danger"});
    }
  })

 return (
  <form
      className="flex flex-col gap-3 items-start"
      onSubmit={onSubmit}
  >
    <Select
        label={tForm("sourceLanguage")}
        errorMessage={errors.sourceLanguage?.message}
        isInvalid={!!errors.sourceLanguage}
        defaultSelectedKeys={user.preferences?.sourceLanguage ? [user.preferences.sourceLanguage[0].toUpperCase() + user.preferences.sourceLanguage[1]] : []}
        {...register("sourceLanguage")}
    >
      {Object.keys(ChapterLanguage).map(language =>
          <SelectItem key={language}>
            {ChapterLanguageFull[language as ChapterLanguage]}
          </SelectItem>
      )}
    </Select>
    <Select
      label={tForm("targetLanguage")}
      errorMessage={errors.targetLanguage?.message}
      isInvalid={!!errors.targetLanguage}
      defaultSelectedKeys={user.preferences?.targetLanguage ? [user.preferences.targetLanguage[0].toUpperCase() + user.preferences.targetLanguage[1]] : []}
      {...register("targetLanguage")}
    >
      {Object.keys(ChapterLanguage).map(language =>
        <SelectItem key={language}>
          {ChapterLanguageFull[language as ChapterLanguage]}
        </SelectItem>
      )}
    </Select>
    <Button isLoading={isSubmitting} color="primary" type="submit">
      {tButton("save")}
    </Button>
  </form>
 );
};