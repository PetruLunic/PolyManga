import {createContext, ReactNode, useContext, useState} from "react";
import SignInForm from "@/app/_components/signForms/SignInForm";
import SignUpForm from "@/app/_components/signForms/SignUpForm";
import {useDisclosure} from "@nextui-org/react";
import VerifyEmailForm from "@/app/_components/signForms/VerifyEmailForm";
import {ModalProps} from "@/app/types";
import ForgotPasswordModal1 from "@/app/_components/signForms/ForgotPasswordModals/ForgotPasswordModal1";

const ModalsName = ["signIn", "signUp", "verifyEmail", "forgotPassword"] as const;

type ModalsName = typeof ModalsName[number];

type ModalsState = Record<ModalsName, ModalProps>;

const ModalsContext = createContext<ModalsState | undefined>(undefined);

export const ModalsProvider = ({ children }: { children: ReactNode }) => {
  const signIn = {...useDisclosure(), prop: useState<string | undefined>()};
  const signUp = {...useDisclosure(), prop: useState<string | undefined>()};
  const verifyEmail = {...useDisclosure(), prop: useState<string | undefined>()};
  const forgotPassword = {...useDisclosure(), prop: useState<string | undefined>()};

  return (
    <ModalsContext.Provider value={{ signIn, signUp, verifyEmail, forgotPassword }}>
      {children}
      <SignInForm {...signIn} />
      <SignUpForm {...signUp} />
      <VerifyEmailForm {...verifyEmail} />
      <ForgotPasswordModal1 {...forgotPassword} />
    </ModalsContext.Provider>
  );
};

export const useModal = (name: ModalsName) => {
  const context = useContext(ModalsContext);

  if (!context) {
    throw new Error("useModal must be used within the ModalsProvider");
  }

  return context[name];
};