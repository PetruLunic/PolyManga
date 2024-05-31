"use client"

import {Button} from "@nextui-org/react";
import {FaUser} from "react-icons/fa";
import {useSession} from "next-auth/react";
import UserAvatar from "@/app/_components/navbar/UserAvatar";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {useEffect} from "react";

export default function SignUpButton() {
  const {onOpen} = useModal("signIn");
  const session = useSession();

  return (
      <>
        {session.status === "authenticated"
          ? <UserAvatar />
          : <Button
              isIconOnly
              variant="light"
              radius="full"
              onClick={onOpen}
              isDisabled={session.status === "loading"}
          >
            <FaUser/>
          </Button>}
      </>
 );
};