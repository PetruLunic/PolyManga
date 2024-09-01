"use client"

import {
  Button,
  Listbox, ListboxItem,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  useDisclosure
} from "@nextui-org/react";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_RATING, DELETE_RATING} from "@/app/lib/graphql/mutations";
import {useEffect, useState} from "react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {useSession} from "next-auth/react";
import {IS_RATED} from "@/app/lib/graphql/queries";
import {useAlert} from "@/app/lib/contexts/AlertContext";

interface Props{
  mangaId: string,
  rating?: number,
  nrVotes?: number
}

const ratingList = ["Terrible", "Very Bad", "Bad", "Poor", "So-So", "Fair", "Good", "Very Good", "Great", "Excellent"];

export default function RatingButton({mangaId, rating, nrVotes}: Props) {
  const {onOpen} = useModal("signIn");
  const session = useSession();

  return (
    <>
      {session.data
        ? <RatingButtonAuthenticated mangaId={mangaId} rating={rating} nrVotes={nrVotes}/>
        : <Button
              onClick={onOpen}
              variant="light"
              size="sm"
              className="px-1 text-sm gap-1"
          >
            <FaRegStar color="orange" size={22}/>
            {rating}
            <span>({nrVotes})</span>
          </Button>}
    </>
  )
}

export function RatingButtonAuthenticated({mangaId, rating, nrVotes}: Props) {
  const {data, loading: loadingIsRated} = useQuery(IS_RATED, {variables: {mangaId}});
  const [ratedValue, setRatedValue] = useState(data?.isRated);
  const [addRating, {loading: loadingAdd}] = useMutation(ADD_RATING);
  const [deleteRating, {loading: loadingDelete}] = useMutation(DELETE_RATING);
  const {onOpen, onOpenChange, isOpen, onClose} = useDisclosure();
  const [selectedRating, setSelectedRating] = useState("10");
  const {addAlert} = useAlert();

  useEffect(() => {
    setRatedValue(data?.isRated);
  }, [data]);

  // If user saved new rating then set the default select to this rating
  useEffect(() => {
    if (!ratedValue) return;

    setSelectedRating(ratedValue.toString());
  }, [ratedValue]);

  const onSave = async () => {
    try {
      await addRating({variables: {input: {
            mangaId,
            value: Number.parseInt(selectedRating)
          }}});

      addAlert({message: "Rating added!", type: "success"});
      setRatedValue(Number.parseInt(selectedRating));
      onClose();
    } catch(e) {
      console.error(e);
      addAlert({message: "Unexpected error!", type: "danger"});
    }
  }

  const onDelete = async () => {
    try {
      await deleteRating({variables: {mangaId}});
      addAlert({message: "Rating deleted!", type: "success"});
      setRatedValue(null);
      onClose();
    } catch(e) {
      console.error(e);
      addAlert({message: "Unexpected error!", type: "danger"});
    }
  }

 return (
  <>
    <Button
      onClick={onOpen}
      isDisabled={loadingAdd || loadingDelete || loadingIsRated}
      variant="light"
      size="sm"
      className="px-1 text-sm gap-1"
    >
      {ratedValue
        ? <FaStar color="orange" size={22}/>
        : <FaRegStar color="orange" size={22}/>}
      {rating}
      <span>({nrVotes})</span>
    </Button>
    <Modal isOpen={isOpen} onOpenChange={onOpenChange}>
      <ModalContent>
        {() => (
            <>
              <ModalHeader className="flex flex-col gap-1">Rate manga</ModalHeader>
              <ModalBody>
                {ratedValue && <div className="">
                    Your rating: <span className="font-bold">{ratedValue}</span>
                </div>}
                <Listbox
                    aria-label="Select rating"
                    variant="flat"
                    disallowEmptySelection
                    classNames={{
                      list: "flex-col-reverse"
                    }}
                    selectionMode="single"
                    selectedKeys={[selectedRating]}
                    onSelectionChange={value => {
                      if (value === "all") return;
                      const key = Array.from(value.keys())[0];
                      setSelectedRating(key as string);
                    }}
                >
                  {ratingList.map((text, index) =>
                    <ListboxItem key={index + 1} className="py-2 px-4" textValue={text}>
                      {index + 1} - {text}
                    </ListboxItem>
                  )}
                </Listbox>
              </ModalBody>
              <ModalFooter>
                {ratedValue &&
                    <Button
                    color="danger"
                    variant="light"
                    isLoading={loadingDelete}
                    onPress={onDelete}
                    isDisabled={loadingAdd}
                >
                    Delete
                </Button>}
                <Button
                    color="primary"
                    onPress={onSave}
                    isLoading={loadingAdd}
                    isDisabled={loadingDelete}
                >
                  Save
                </Button>
              </ModalFooter>
            </>
        )}
      </ModalContent>
    </Modal>
  </>
 );
}