"use client"

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@heroui/react";
import Alert from "@/app/_components/Alert";
import {Input} from "@heroui/input";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {ModalProps} from "@/app/types";
import {IoIosMail} from "react-icons/io";
import {generateAndSendEmailToken} from "@/app/lib/userActions";
import {useTranslations} from "next-intl";
import VerifyEmailForm from "@/app/_components/signForms/VerifyEmailForm";
import {UserSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";
import {zodResolver} from "@hookform/resolvers/zod";

type Props = Partial<ModalProps>;

const FormSchema = UserSchema.pick({email: true});
type FormType = z.infer<typeof FormSchema>;

export default function ForgotPasswordModal1({isOpen, onOpenChange, onClose}: Props) {
  const t = useTranslations("components.modals.forgotPassword");
  const modal2Controllers = useDisclosure();
  const modal2State = useState<string | undefined>();
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors,
      isSubmitting,
    }
  } = useForm<FormType>({
    resolver: zodResolver(FormSchema)
  });

  const onSubmit = handleSubmit(async data => {
    const response = await generateAndSendEmailToken(data.email, "resetPassword");

    if (!response.success) {
      setError("root", {type: "custom", message: response.message});
      return;
    } else {
      modal2State[1](JSON.stringify({email: data.email, type: "resetPassword"}));
      onClose && onClose();
      modal2Controllers.onOpen();
    }
  })

  return (
      <>
        <Modal
            isOpen={isOpen}
            onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
                <form onSubmit={onSubmit}>
                  <ModalHeader className="flex flex-col gap-1">{t("forgotPassword")}</ModalHeader>
                  <ModalBody>
                    <Alert title={t("errors.submit")} description={errors.root?.message} isVisible={!!errors.root} type="danger"/>
                    <Input
                        autoFocus
                        endContent={
                          <IoIosMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label={t("email")}
                        placeholder={t("placeholders.email")}
                        errorMessage={errors.email?.message}
                        isInvalid={!!errors.email}
                        variant="bordered"
                        type="email"
                        required
                        {...register("email")}
                    />
                  </ModalBody>
                  <ModalFooter>
                    <Button color="danger" variant="flat" onPress={onClose}>
                      {t("close")}
                    </Button>
                    <Button color="primary" type="submit" isLoading={isSubmitting}>
                      {t("submit")}
                    </Button>
                  </ModalFooter>
                </form>
            )}
          </ModalContent>
        </Modal>
        <VerifyEmailForm {...modal2Controllers} prop={modal2State}/>
      </>
  );
};