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
import React, {useEffect} from "react";
import {Input} from "@nextui-org/input";
import {IoIosMail} from "react-icons/io";
import {MdOutlinePassword} from "react-icons/md";
import {FaFacebookF, FaGoogle, FaUser} from "react-icons/fa";
import {Divider} from "@nextui-org/divider";
import AuthButtons from "@/app/_components/AuthButtons";

export default function SignUpForm() {
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  useEffect(() => {
    onOpen();
  }, []);

 return (
     <Modal
         isOpen={isOpen}
         onOpenChange={onOpenChange}
         placement="top-center"
     >
       <ModalContent>
         {(onClose) => (
             <form>
               <ModalHeader className="flex flex-col gap-1">Sign Up</ModalHeader>
               <ModalBody>
                 <AuthButtons/>
                 <div className="text-center mb-4 text-gray-300 text-sm">
                   or
                 </div>
                 <Input
                     autoFocus
                     endContent={
                       <FaUser className="text-xl text-default-400 pointer-events-none flex-shrink-0" />
                     }
                     label="User name"
                     placeholder="Enter your user name"
                     variant="bordered"
                     type="text"
                 />
                 <Input
                     autoFocus
                     endContent={
                       <IoIosMail className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                     }
                     label="Email"
                     placeholder="Enter your email"
                     variant="bordered"
                     type="email"
                 />
                 <Input
                     endContent={
                       <MdOutlinePassword  className="text-2xl text-default-400 pointer-events-none flex-shrink-0" />
                     }
                     label="Password"
                     placeholder="Enter your password"
                     type="password"
                     variant="bordered"
                 />
                 <div className="flex py-2 px-1 justify-between">
                   <Checkbox
                       classNames={{
                         label: "text-small",
                       }}
                   >
                     Remember me
                   </Checkbox>
                   <Link color="primary" href="#" size="sm">
                     Forgot password?
                   </Link>
                 </div>
               </ModalBody>
               <ModalFooter>
                 <Button color="danger" variant="flat" onPress={onClose}>
                   Close
                 </Button>
                 <Button color="primary" onPress={onClose}>
                   Sign up
                 </Button>
               </ModalFooter>
             </form>
         )}
       </ModalContent>
     </Modal>
 );
};