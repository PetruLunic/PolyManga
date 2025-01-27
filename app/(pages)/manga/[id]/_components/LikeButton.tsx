"use client"

import {Button} from "@heroui/react";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {useMutation, useQuery} from "@apollo/client";
import {LIKE, UNLIKE} from "@/app/lib/graphql/mutations";
import {useEffect, useState} from "react";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {formatNumber} from "@/app/lib/utils/formatNumber";
import {IS_LIKED} from "@/app/lib/graphql/queries";

interface Props{
  mangaId: string,
  nrLikes?: number,
}

export default function LikeButton({mangaId, nrLikes}: Props) {
  const session = useSession();
  const {onOpen} = useModal("signIn")

 return (
   <>
     {session.data
         ? <LikeButtonAuthenticated mangaId={mangaId} nrLikes={nrLikes}/>
         : <Button
             size="sm"
             variant="light"
             className="px-1 text-sm gap-1"
             onPress={onOpen}
         >
           <IoMdHeartEmpty size={22}/>
           {nrLikes}
         </Button>}
   </>
 );
};

function LikeButtonAuthenticated({mangaId, nrLikes}: Props) {
  const {data} = useQuery(IS_LIKED, {variables: {objectId: mangaId}});
  const [like, {loading: loadingLike}] = useMutation(LIKE);
  const [unlike, {loading: loadingUnlike}] = useMutation(UNLIKE);
  const [isLikedState, setIsLikedState] = useState(false);
  const {addAlert} = useAlert();

  useEffect(() => {
    if (!data) return;

    setIsLikedState(!!data.isLiked);
  }, [data]);

  const onClick = async () => {
    try {
      // Update optimistic the like button
      setIsLikedState(prev => !prev);

      if (isLikedState) {
        await unlike({variables: {objectId: mangaId}});

        addAlert({message: "Unliked!", type: "success"});
      } else {
        await like({
          variables: {
            input: {
              objectId: mangaId,
              objectType: "Manga"
            }
          }
        })
        addAlert({message: "Liked!", type: "success"});
      }
    } catch(e) {
      console.error(e);
      
      // Rollback state on error
      setIsLikedState(prev => !prev);
      addAlert({message: "Unexpected error!", type: "danger"});
    }
  }

  return (
      <Button
          size="sm"
          variant="light"
          className="px-1 text-sm gap-1"
          onPress={onClick}
          isDisabled={loadingLike || loadingUnlike}
      >
        {isLikedState
            ? <IoMdHeart size={22}/>
            : <IoMdHeartEmpty size={22}/>}
        {formatNumber(nrLikes ?? 0)}
      </Button>
  );
}