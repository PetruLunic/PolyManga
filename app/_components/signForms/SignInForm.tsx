"use client"

import {
  Button,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
} from "@heroui/react";
import React from "react";
import {Input} from "@heroui/input";
import {IoIosMail} from "react-icons/io";
import AuthButtons from "@/app/_components/signForms/AuthButtons";
import {useForm} from "react-hook-form";
import {UserSignIn} from "@/app/lib/graphql/schema";
import {generateAndSendEmailToken, signIn} from "@/app/lib/userActions";
import Alert from "@/app/_components/Alert";
import {ModalProps, useModal} from "@/app/lib/contexts/ModalsContext";
import InputPassword from "@/app/_components/InputPassword";
import {useTranslations} from "next-intl";
import {zodResolver} from "@hookform/resolvers/zod";
import {UserSignInSchema} from "@/app/lib/utils/zodSchemas";

type Props = Partial<ModalProps>;

export default function SignInForm({isOpen, onOpenChange, onClose}: Props) {
  const t = useTranslations("components.modals.signInOut");
  const {onOpen: onSignUpOpen} = useModal("signUp");
  const {onOpen: onVerifyEmailOpen, prop: [_, setEmail]} = useModal("verifyEmail");
  const {onOpen: onForgotPasswordOpen} = useModal("forgotPassword");
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors ,
      isSubmitting,
    }
  } = useForm<UserSignIn>({
    resolver: zodResolver(UserSignInSchema)
  });

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signIn(data);

      if (!response.success) {
        // If user's email is not verified
        if (response.message === "Unverified email") {
          setEmail(data.email);
          onClose && onClose();
          generateAndSendEmailToken(data.email, "verifyEmail");
          onVerifyEmailOpen();
        }

        setError("root", {type: "custom", message: response.message});
        return;
      } else {
        // Close the modal and refresh the page
        onClose && onClose();
        location.reload();
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
                <ModalHeader className="flex flex-col gap-1">{t("signIn")}</ModalHeader>
                <ModalBody>
                  <AuthButtons/>
                  <div className="text-center mb-4 text-gray-300 text-sm">
                    {t("or")}
                  </div>
                  <Alert title={t("errors.submit")} description={errors.root?.message} isVisible={!!errors.root} type="danger"/>
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
                  <div className="flex py-2 px-1 justify-between">
                    <Button
                        color="primary"
                        variant="light"
                        onPress={() => setTimeout(() => {
                          onSignUpOpen();
                          onClose();
                        }, 0)}
                    >
                      {t("signUp")}
                    </Button>
                    <Button
                        color="primary"
                        variant="light"
                        onPress={() => {
                          onForgotPasswordOpen();
                          onClose();
                        }}
                    >
                      {t("forgotPassword")}
                    </Button>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    {t("close")}
                  </Button>
                  <Button color="primary" type="submit" isLoading={isSubmitting}>
                    {t("signIn")}
                  </Button>
                </ModalFooter>
              </form>
          )}
        </ModalContent>
      </Modal>
  );
};