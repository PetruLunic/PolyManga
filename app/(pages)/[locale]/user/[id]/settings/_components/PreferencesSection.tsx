"use client"

import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserPreferencesSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";
import {Session} from "next-auth";
import {Button, Select, SelectItem} from "@heroui/react";
import {ChapterLanguageFull} from "@/app/types";
import {changeUserPreferences} from "@/app/(pages)/[locale]/user/[id]/settings/actions";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {useSession} from "next-auth/react";
import {ChapterLanguage} from "@/app/__generated__/graphql";

interface Props{
  user: Session["user"]
}

export type FormType = z.infer<typeof UserPreferencesSchema>;

export default function PreferencesSection({user}: Props) {
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
      await update({user: {...session?.user, preferences: data}});
      addAlert({message: "Preferences changed", type: "success"});
    } catch(e) {
      console.error(e);
      addAlert({message: "Unexpected error", type: "danger"});
    }
  })

 return (
  <form
      className="flex flex-col gap-3 items-start"
      onSubmit={onSubmit}
  >
    <Select
        label="Language"
        description="One-click swap of the language at the chapter images"
        errorMessage={errors.language?.message}
        isInvalid={!!errors.language}
        defaultSelectedKeys={user.preferences?.language ? [user.preferences.language] : []}
        {...register("language")}
    >
      {Object.keys(ChapterLanguage).map(language =>
          <SelectItem key={language.toLowerCase()}>
            {ChapterLanguageFull[language as ChapterLanguage]}
          </SelectItem>
      )}
    </Select>
    <Button isLoading={isSubmitting} color="primary" type="submit">
      Save
    </Button>
  </form>
 );
};