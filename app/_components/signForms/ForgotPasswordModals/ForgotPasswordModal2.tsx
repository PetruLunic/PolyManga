"use client"

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@nextui-org/react";
import Alert from "@/app/_components/Alert";
import {Input} from "@nextui-org/input";
import React from "react";
import {FaKey} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {ModalProps} from "@/app/types";
import {resetPasswordAndSignIn} from "@/app/userActions";
import {zodResolver} from "@hookform/resolvers/zod";
import {MdOutlinePassword} from "react-icons/md";
import {ResetPasswordSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";

type Props = Partial<ModalProps>;

export default function ForgotPasswordModal2({isOpen, onOpenChange, prop, onClose}: Props) {
  const {
    handleSubmit,
    register,
    setError,
    formState: {
      errors ,
      isSubmitting,
    }
  } = useForm<z.infer<typeof ResetPasswordSchema>>({
    resolver: zodResolver(ResetPasswordSchema)
  });

  const onSubmit = handleSubmit(async data => {
    if (!prop || !prop[0]) return;

    const response = await resetPasswordAndSignIn(prop[0], data.newPassword, data.token);

    // If is successful close the modal and reload the page
    if (!response.success) {
      setError("root", {type: "custom", message: response.message});
    } else {
      onClose && onClose();
      location.reload();
    }
  })

  return (
      <Modal
          isDismissable={false}
          isOpen={isOpen}
          onOpenChange={onOpenChange}
      >
        <ModalContent>
          {(onClose) => (
              <form onSubmit={onSubmit}>
                <ModalHeader className="flex flex-col gap-1">Verify Email</ModalHeader>
                <ModalBody>
                  <Alert title="Submit error" description={errors.root?.message} isVisible={!!errors.root} type="danger"/>
                  <div className="">
                    Token was sent to your <span className="font-bold">{prop && prop[0]}</span> email
                  </div>
                  <Input
                      autoFocus
                      endContent={
                        <FaKey className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Token"
                      placeholder="Enter the token"
                      errorMessage={errors.token?.message}
                      isInvalid={!!errors.token}
                      variant="bordered"
                      type="text"
                      required
                      {...register("token")}
                  />
                  <Input
                      endContent={
                        <MdOutlinePassword  className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="New password"
                      placeholder="Enter your new password"
                      errorMessage={errors.newPassword?.message}
                      isInvalid={!!errors.newPassword}
                      type="password"
                      variant="bordered"
                      {...register("newPassword")}
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
  );
};