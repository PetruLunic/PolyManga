"use client"

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import React, {useEffect, useRef, useState} from "react";
import {ModalProps} from "@/app/types";
import {generateAndSendEmailToken} from "@/app/lib/userActions";
import {useTranslations} from "next-intl";
import {useAlert} from "@/app/lib/contexts/AlertContext";

type Props = Partial<ModalProps>;

export default function VerifyEmailForm({isOpen, onOpenChange, prop}: Props) {
  const {addAlert} = useAlert();
  const {email, type} = JSON.parse(prop ? prop[0] ?? "{}" : "{}"); // Extracting email and type from outside prop
  const t = useTranslations("components.modals.verifyEmail");
  const [timer, setTimer] = useState(60);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  const onSendEmailClick = async () => {
   if (!email || !type) return;

   setTimer(60);

   intervalRef.current = setInterval(() => {
     setTimer(prev => {
       if (prev <= 0) {
         intervalRef.current && clearInterval(intervalRef.current);
         intervalRef.current = null;
         return 0;
       }
       return prev - 1;
     });
   }, 1000);

    const response = await generateAndSendEmailToken(email, type);

    if (!response.success) {
      addAlert({message: response.message, type: "danger", delay: 10000})
    }
  }

  // Set email send button timer
  useEffect(() => {
  if (isOpen && !intervalRef.current) {
   intervalRef.current = setInterval(() => {
     setTimer(prev => {
     if (prev <= 0) {
      intervalRef.current && clearInterval(intervalRef.current);
      return 0;
     }
     return prev - 1;
    });
   }, 1000);
  } else if (!isOpen) {
    setTimer(60);
    intervalRef.current && clearInterval(intervalRef.current);
    intervalRef.current = null;
  }

  // Cleanup function to clear interval if the component unmounts
  return () => {
   intervalRef.current && clearInterval(intervalRef.current);
  }
  }, [isOpen]);

 return (
     <Modal
         isDismissable={false}
         isOpen={isOpen}
         onOpenChange={onOpenChange}
     >
      <ModalContent>
       {(onClose) => (
         <>
           <ModalHeader className="flex flex-col gap-1">{t("header")}</ModalHeader>
           <ModalBody>
             <div>
               {t.rich("message", {
                 email: () => <span className="font-bold">{email}</span>
               })}
             </div>
             <Button
               color="primary"
               isDisabled={timer > 0}
               onPress={onSendEmailClick}
             >
               {t("resendButton", {seconds: timer})}
             </Button>
           </ModalBody>
           <ModalFooter>
             <Button color="danger" variant="flat" onPress={onClose}>
               {t("close")}
             </Button>
           </ModalFooter>
         </>
       )}
      </ModalContent>
     </Modal>
 );
};