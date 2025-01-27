"use client"

import {Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader} from "@heroui/react";
import Alert from "@/app/_components/Alert";
import {Input} from "@heroui/input";
import React, {useEffect, useRef, useState} from "react";
import {FaKey} from "react-icons/fa";
import {useForm} from "react-hook-form";
import {ModalProps} from "@/app/types";
import {generateAndSendEmailToken, verifyEmailAndSignIn} from "@/app/userActions";
import {zodResolver} from "@hookform/resolvers/zod";
import {TokenSchema} from "@/app/lib/utils/zodSchemas";
import z from "zod";

type Props = Partial<ModalProps>;

const FormSchema = z.object({
  token: TokenSchema
})

export default function VerifyEmailForm({isOpen, onOpenChange, prop, onClose}: Props) {
 const [timer, setTimer] = useState(60);
 const intervalRef = useRef<NodeJS.Timeout | null>(null);
 const {
  handleSubmit,
  register,
  setError,
  formState: {
   errors ,
   isSubmitting,
  }
 } = useForm<z.infer<typeof FormSchema>>({
  resolver: zodResolver(FormSchema)
 });

 const onSendEmailClick = async () => {
   if (!prop || !prop[0]) return;

   setTimer(60);

   intervalRef.current = setInterval(() => {
     setTimer(prev => {
       if (prev <= 0) {
         intervalRef.current && clearInterval(intervalRef.current);
         return 0;
       }
       return prev - 1;
     });
   }, 1000);

   await generateAndSendEmailToken(prop[0], "verifyEmail");
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

 const onSubmit = handleSubmit(async data => {
  if (!prop || !prop[0]) return;

  const response = await verifyEmailAndSignIn(prop[0], data.token);

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
              On your <span className="font-bold">{prop && prop[0]}</span> email was sent a message with a token. Please copy the token and paste it here.
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
             <Button
                 color="primary"
                disabled={timer > 0}
                onPress={onSendEmailClick}
             >
               Resend the email {timer > 0 && `after ${timer} seconds`}
             </Button>
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