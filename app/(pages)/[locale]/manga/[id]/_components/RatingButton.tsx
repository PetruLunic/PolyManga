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
} from "@heroui/react";
import {FaRegStar, FaStar} from "react-icons/fa";
import {useMutation, useQuery} from "@apollo/client";
import {ADD_RATING, DELETE_RATING} from "@/app/lib/graphql/mutations";
import {useEffect, useState} from "react";
import {useModal} from "@/app/lib/contexts/ModalsContext";
import {useSession} from "next-auth/react";
import {useAlert} from "@/app/lib/contexts/AlertContext";
import {IS_RATED} from "@/app/lib/graphql/queries";
import {formatNumber} from "@/app/lib/utils/formatNumber";
import {useTranslations} from "next-intl";

interface Props{
  slug: string,
  mangaTitle?: string,
  rating?: number,
  nrVotes?: number
}

const ratingList = ["terrible", "veryBad", "bad", "poor", "soSo", "fair", "good", "veryGood", "great", "excellent"] as const;

export default function RatingButton({slug, rating, nrVotes, mangaTitle}: Props) {
  const {onOpen} = useModal("signIn");
  const session = useSession();

  return (
    <>
      {session.data
        ? <RatingButtonAuthenticated slug={slug} rating={rating} nrVotes={nrVotes} mangaTitle={mangaTitle}/>
        : <Button
              onPress={onOpen}
              variant="light"
              size="sm"
              className="px-1 text-sm gap-1"
          >
            <FaRegStar color="orange" size={22}/>
            {rating}
            <span>({formatNumber(nrVotes ?? 0)})</span>
          </Button>}
    </>
  )
}

export function RatingButtonAuthenticated({slug, rating, nrVotes, mangaTitle}: Props) {
  const t = useTranslations("components.buttons.rating");
  const {data} = useQuery(IS_RATED, {variables: {slug}});
  const [ratedValue, setRatedValue] = useState<number | null | undefined>(null);
  const [addRating, {loading: loadingAdd}] = useMutation(ADD_RATING);
  const [deleteRating, {loading: loadingDelete}] = useMutation(DELETE_RATING);
  const {onOpen, onOpenChange, isOpen, onClose} = useDisclosure();
  const [selectedRating, setSelectedRating] = useState("10");
  const {addAlert} = useAlert();

  useEffect(() => {
    setRatedValue(data?.isRated)
  }, [data]);

  // If user saved new rating then set the default select to this rating
  useEffect(() => {
    if (!ratedValue) return;

    setSelectedRating(ratedValue.toString());
  }, [ratedValue]);

  const onSave = async () => {
    try {
      await addRating({variables: {input: {
            slug,
            value: Number.parseInt(selectedRating)
          }}});

      addAlert({message: t("alerts.success"), type: "success"});
      setRatedValue(Number.parseInt(selectedRating));
      onClose();
    } catch(e) {
      console.error(e);
      addAlert({message: t("alerts.error"), type: "danger"});
    }
  }

  const onDelete = async () => {
    try {
      await deleteRating({variables: {slug}});
      addAlert({message: t("alerts.delete"), type: "success"});
      setRatedValue(null);
      onClose();
    } catch(e) {
      console.error(e);
      addAlert({message: t("alerts.error"), type: "danger"});
    }
  }

 return (
  <>
    <Button
      onPress={onOpen}
      isDisabled={loadingAdd || loadingDelete}
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
              <ModalHeader className="flex flex-col gap-1">{t("rate")} {mangaTitle ?? "comics"}</ModalHeader>
              <ModalBody>
                {ratedValue && <div>
                  {t("yourRating")}: <span className="font-bold">{ratedValue}</span>
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
                    <ListboxItem key={index + 1} className="py-2 px-4" textValue={t(`ratings.${text}`)}>
                      {index + 1} - {t(`ratings.${text}`)}
                    </ListboxItem>
                  )}
                </Listbox>
              </ModalBody>
              <ModalFooter>
                <Button
                  color="default"
                  variant="light"
                  onPress={onClose}
                >
                  {t("close")}
                </Button>
                {ratedValue &&
                    <Button
                    color="danger"
                    isLoading={loadingDelete}
                    onPress={onDelete}
                    isDisabled={loadingAdd}
                >
                  {t("delete")}
                </Button>}
                <Button
                    color="primary"
                    onPress={onSave}
                    isLoading={loadingAdd}
                    isDisabled={loadingDelete}
                >
                  {t("save")}
                </Button>
              </ModalFooter>
            </>
        )}
      </ModalContent>
    </Modal>
  </>
 );
}