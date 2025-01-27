"use client"

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, useDisclosure} from "@heroui/react";
import Alert from "@/app/_components/Alert";
import {Input} from "@heroui/input";
import React, {useState} from "react";
import {useForm} from "react-hook-form";
import {ModalProps} from "@/app/types";
import {IoIosMail} from "react-icons/io";
import {generateAndSendEmailToken} from "@/app/userActions";
import ForgotPasswordModal2 from "@/app/_components/signForms/ForgotPasswordModals/ForgotPasswordModal2";

type Props = Partial<ModalProps>;

export default function ForgotPasswordModal1({isOpen, onOpenChange, onClose}: Props) {
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
  } = useForm<{ email: string }>();

  const onSubmit = handleSubmit(async data => {
    const response = await generateAndSendEmailToken(data.email, "forgotPassword");

    if (!response.success) {
      setError("root", {type: "custom", message: response.message});
      return;
    } else {
      modal2State[1](data.email);
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
                  <ModalHeader className="flex flex-col gap-1">Forgot Password</ModalHeader>
                  <ModalBody>
                    <Alert title="Submit error" description={errors.root?.message} isVisible={!!errors.root} type="danger"/>
                    <Input
                        autoFocus
                        endContent={
                          <IoIosMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                        }
                        label="Email"
                        placeholder="Enter your email"
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
                      Close
                    </Button>
                    <Button color="primary" type="submit" isLoading={isSubmitting}>
                      Submit
                    </Button>
                  </ModalFooter>
                </form>
            )}
          </ModalContent>
        </Modal>
        <ForgotPasswordModal2 {...modal2Controllers} prop={modal2State}/>
      </>
  );
};