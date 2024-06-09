"use client"

import {Button} from "@nextui-org/react";
import {IoMdHeart, IoMdHeartEmpty} from "react-icons/io";
import {useMutation, useQuery} from "@apollo/client";
import {LIKE, UNLIKE} from "@/app/lib/graphql/mutations";
import {useEffect, useState} from "react";
import {IS_LIKED} from "@/app/lib/graphql/queries";
import {useSession} from "next-auth/react";
import {useModal} from "@/app/lib/contexts/ModalsContext";

interface Props{
  mangaId: string,
  nrLikes?: number
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
             onClick={onOpen}
         >
           <IoMdHeartEmpty size={22}/>
           {nrLikes}
         </Button>}
   </>
 );
};

function LikeButtonAuthenticated({mangaId, nrLikes}: Props) {
  const {data, loading: loadingIsLiked} = useQuery(IS_LIKED, {variables: {objectId: mangaId}});
  const [like, {loading: loadingLike}] = useMutation(LIKE);
  const [unlike, {loading: loadingUnlike}] = useMutation(UNLIKE);
  const [isLiked, setIsLiked] = useState(false);

  useEffect(() => {
    if (!data?.isLiked) return;

    setIsLiked(data.isLiked);
  }, [data]);

  const onClick = () => {
    if (isLiked) {
      unlike({variables: {objectId: mangaId}})
    } else {
      like({
        variables: {
          input: {
            objectId: mangaId,
            objectType: "Manga"
          }
        }
      })
    }

    setIsLiked(prev => !prev);
  }

  return (
      <Button
          size="sm"
          variant="light"
          className="px-1 text-sm gap-1"
          onClick={onClick}
          disabled={loadingLike || loadingUnlike || loadingIsLiked}
      >
        {isLiked
            ? <IoMdHeart size={22}/>
            : <IoMdHeartEmpty size={22}/>}
        {nrLikes}
      </Button>
  );
}