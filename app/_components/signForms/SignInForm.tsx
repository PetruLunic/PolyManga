"use client"

import {
  Button,
  Checkbox,
  Link,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import React from "react";
import {Input} from "@nextui-org/input";
import {IoIosMail} from "react-icons/io";
import {MdOutlinePassword} from "react-icons/md";
import AuthButtons from "@/app/_components/signForms/AuthButtons";
import {useForm} from "react-hook-form";
import {UserSignIn} from "@/app/lib/graphql/schema";
import {signIn} from "@/app/userActions";
import Alert from "@/app/_components/Alert";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {useRouter} from "next/navigation";
import {ModalProps} from "@/app/types";

type Props = Partial<ModalProps>;

export default function SignInForm({isOpen, onOpenChange, onClose}: Props) {
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
  } = useForm<UserSignIn>();

  const onSubmit = handleSubmit(async (data) => {
    try {
      const response = await signIn(data);

      if (!response.success) {
        // If user's email is not verified
        if (response.message === "Unverified email") {
          setEmail(data.email);
          onClose && onClose();
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
      setError("root", {type: "custom", message: "Unexpected error!"})
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
                <ModalHeader className="flex flex-col gap-1">Sign In</ModalHeader>
                <ModalBody>
                  <AuthButtons/>
                  <div className="text-center mb-4 text-gray-300 text-sm">
                    or
                  </div>
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
                      {...register("email")}
                  />
                  <Input
                      endContent={
                        <MdOutlinePassword  className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                      }
                      label="Password"
                      placeholder="Enter your password"
                      errorMessage={errors.password?.message}
                      isInvalid={!!errors.password}
                      type="password"
                      variant="bordered"
                      {...register("password")}
                  />
                  <div className="flex py-2 px-1 justify-between">
                    <Button
                        color="primary"
                        variant="light"
                        onClick={() => {
                          onSignUpOpen();
                          onClose();
                        }}
                    >
                      Sign Up
                    </Button>
                    <Button
                        color="primary"
                        variant="light"
                        onClick={() => {
                          onForgotPasswordOpen();
                          onClose();
                        }}
                    >
                      Forgot password?
                    </Button>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Button color="danger" variant="flat" onPress={onClose}>
                    Close
                  </Button>
                  <Button color="primary" type="submit" isLoading={isSubmitting}>
                    Sign up
                  </Button>
                </ModalFooter>
              </form>
          )}
        </ModalContent>
      </Modal>
  );
};