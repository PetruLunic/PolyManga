"use client"

import {Input} from "@nextui-org/input";
import MangaList from "@/app/_components/MangaList";
import {useEffect, useState} from "react";
import useDebounce from "@/app/lib/hooks/useDebounce";
import {useQueryParams} from "@/app/lib/hooks/useQueryParams";
import {useSearchParams} from "next/navigation";
import {useQuery} from "@apollo/client";
import {GET_MANGA_CARDS, MANGA_CARD} from "@/app/lib/graphql/queries";
import {getFragmentData} from "@/app/__generated__";
import {
  Button, Card, CardBody,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  Spinner,
  useDisclosure
} from "@nextui-org/react";
import {ChapterLanguage, ComicsGenre, ComicsStatus, ComicsType} from "@/app/__generated__/graphql";
import {FaFilter} from "react-icons/fa";
import FilterInputs from "@/app/(pages)/manga/_components/FilterInputs";
import ClearFiltersButton from "@/app/(pages)/manga/_components/ClearFiltersButton";
import SortButton from "@/app/(pages)/manga/_components/SortButton";
import SortBySelect from "@/app/(pages)/manga/_components/SortBySelect";
import {Divider} from "@nextui-org/divider";
import MangaCard from "@/app/_components/MangaCard";

export default function MangaPage() {
  const searchParams = useSearchParams();
  const [searchText, setSearchText] = useState(searchParams.get("search") as string || "");
  const sort = searchParams.get("sort");
  const statuses = searchParams.getAll("status");
  const genres = searchParams.getAll("genre");
  const types = searchParams.getAll("type");
  const sortBy = searchParams.get("sortBy");
  const languages = searchParams.getAll("language");
  const debouncedSearchText = useDebounce(searchText, 1000);
  const {replaceParam} = useQueryParams();
  const {data, loading} = useQuery(GET_MANGA_CARDS,
      {variables: {
          search: debouncedSearchText,
          statuses: statuses as ComicsStatus[],
          types: types as ComicsType[],
          genres: genres as ComicsGenre[],
          sort: sort,
          sortBy: sortBy,
          languages: languages as ChapterLanguage[],
          limit: 20
        }});
  const {isOpen, onOpen, onOpenChange} = useDisclosure();

  const mangas = getFragmentData(MANGA_CARD, data?.mangas);

  // On changing search text
  useEffect(() => {
    replaceParam({"search": debouncedSearchText});
  }, [debouncedSearchText]);

  return (
      <div className="mx-3 flex flex-col gap-3">
        <h2 className="text-xl">Catalog</h2>
        <Input
            label="Search by name"
            value={searchText}
            onValueChange={setSearchText}
        />
        <div className="md:flex items-start md:gap-5">
          <div className="md:flex-grow">
            {loading
                ? <Spinner className="mt-4" size="lg"/>
                : <MangaList >
                  {mangas?.map(manga =>
                      <MangaCard key={manga.id} manga={manga}/>
                  )}
                </MangaList>}
          </div>
          <Card isBlurred className="hidden sticky top-16 md:block max-w-[300px] min-w-[300px]">
            <CardBody className="gap-3">
              <div className="flex justify-between gap-1">
                <h3>Sort</h3>
                <SortButton/>
              </div>
              <SortBySelect/>
              <Divider/>
              <div className="flex justify-between gap-1">
                <h3>Filters</h3>
                <ClearFiltersButton />
              </div>
              <FilterInputs/>
            </CardBody>
          </Card>
        </div>
        <Button
            className="fixed bottom-4 right-4 md:hidden"
            startContent={<FaFilter />}
            onPress={onOpen}
        >
          Filter
        </Button>
        <Modal size="5xl"
               className="md:hidden"
               isOpen={isOpen}
               onOpenChange={onOpenChange}
        >
          <ModalContent>
            {(onClose) => (
                <>
                  <ModalHeader className="flex justify-between gap-1">
                    <h3>Sort</h3>
                    <SortButton/>
                  </ModalHeader>
                  <ModalBody>
                    <SortBySelect/>
                  </ModalBody>
                  <ModalHeader className="flex justify-between gap-1">
                    <h3>Filters</h3>
                    <ClearFiltersButton />
                  </ModalHeader>
                  <ModalBody>
                    <FilterInputs/>
                  </ModalBody>
                  <ModalFooter>
                    <Button color="primary" onPress={onClose}>
                      Close
                    </Button>
                  </ModalFooter>
                </>
            )}
          </ModalContent>
        </Modal>
      </div>
  );
};