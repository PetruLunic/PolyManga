"use client"

import {
  Button,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";
import {Input} from "@heroui/input";
import {IoIosMail} from "react-icons/io";
import {FaUser} from "react-icons/fa";
import AuthButtons from "@/app/_components/signForms/AuthButtons";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserSchema} from "@/app/lib/utils/zodSchemas";
import {UserSignUp} from "@/app/lib/graphql/schema";
import {signUp} from "@/app/lib/userActions";
import Alert from "@/app/_components/Alert";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {ModalProps} from "@/app/types";
import InputPassword from "@/app/_components/InputPassword";
import {useTranslations} from "next-intl";

type Props = Partial<ModalProps>;

export default function SignUpForm({isOpen, onOpenChange, onClose}: Props) {
  const t = useTranslations("components.modals.signInOut");
  const {onOpen: onSignInOpen} = useModal("signIn");
  const {onOpen: onVerifyEmailOpen, prop: [_, setProp]} = useModal("verifyEmail");
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors ,
      isSubmitting
    }
  } = useForm<UserSignUp>({
    resolver: zodResolver(UserSchema),
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signUp(data);

      if (!response.success) {
        setError("root", {type: "custom", message: response.message});
        return;
      } else {
        // If is successful close the modal and open verifyEmail modal
        setProp(JSON.stringify({email: data.email, type: "verifyEmail"}));
        onClose && onClose();
        onVerifyEmailOpen();
      }
    } catch(e) {
        console.error(e);
        setError("root", {type: "custom", message: t("errors.unexpected")})
    }
  })

 return (
     <Modal
         isOpen={isOpen}
         onOpenChange={onOpenChange}
     >
       <ModalContent>
         {(onClose) => (
             <form onSubmit={onSubmit}>
               <ModalHeader className="flex flex-col gap-1">{t("signUp")}</ModalHeader>
               <ModalBody>
                 <AuthButtons/>
                 <div className="text-center mb-4 text-gray-300 text-sm">
                   {t("or")}
                 </div>
                 <Alert title={t("errors.submit")} description={errors.root?.message} isVisible={!!errors.root} type="danger"/>
                 <Input
                     endContent={
                       <FaUser className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                     }
                     label={t("username")}
                     placeholder={t("placeholders.username")}
                     errorMessage={errors.name?.message}
                     isInvalid={!!errors.name}
                     variant="bordered"
                     type="text"
                     {...register("name")}
                 />
                 <Input
                     endContent={
                       <IoIosMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                     }
                     label={t("email")}
                     placeholder={t("placeholders.email")}
                     errorMessage={errors.email?.message}
                     isInvalid={!!errors.email}
                     variant="bordered"
                     type="email"
                     {...register("email")}
                 />
                 <InputPassword
                     label={t("password")}
                     placeholder={t("placeholders.password")}
                     errorMessage={errors.password?.message}
                     isInvalid={!!errors.password}
                     variant="bordered"
                     {...register("password")}
                 />
                 <div className="py-2 px-1">
                   <Button
                       color="primary"
                       variant="light"
                       onPress={() => {
                         onSignInOpen();
                         onClose();
                       }}
                   >
                     {t("signIn")}
                   </Button>
                 </div>
               </ModalBody>
               <ModalFooter>
                 <Button color="danger" variant="flat" onPress={onClose}>
                   {t("close")}
                 </Button>
                 <Button color="primary" type="submit" isLoading={isSubmitting}>
                   {t("signUp")}
                 </Button>
               </ModalFooter>
             </form>
         )}
       </ModalContent>
     </Modal>
 );
};