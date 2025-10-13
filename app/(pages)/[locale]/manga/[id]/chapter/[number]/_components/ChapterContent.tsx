"use client"

import NextImage from "next/image";
import {Button, Card, CardBody} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {useScreenWidth} from "@/app/lib/hooks/useScreenWidth";
import {ChapterMetadata, LocaleType} from "@/app/types";
import {notFound} from "next/navigation";
import LanguageSelectNavbar from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/_components/LanguageSelectNavbar";
import {locales} from "@/i18n/routing";
import {ChapterQuery} from "@/app/__generated__/graphql";
import {IoLanguage} from "react-icons/io5";
import {TbLanguageOff} from "react-icons/tb";
import {motion} from "framer-motion";
import {useChapterLanguage} from "@/app/lib/hooks/useChapterLanguage";
import {ChapterImage} from "@/app/lib/graphql/schema";
import ChapterMetadataText from "@/app/_components/ChapterMetadataText";
import scaleFontSizes from "@/app/lib/utils/scaleFontSizes";
import fonts from "@/app/lib/fonts";
import {DEFAULT_CHAPTER_FONT_FAMILY} from "@/app/lib/utils/constants";

const METADATA_BOX_PADDING = 0;
const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;

interface Props {
  chapter: ChapterQuery["chapter"];
  metadata: ChapterMetadata["content"] | null;
}

export default function ChapterContent({chapter, metadata}: Props) {
  const sourceLang = useChapterLanguage({queryName: "source_lang"});
  const targetLang = useChapterLanguage({queryName: "target_lang"});
  const [activeTargetIndex, setActiveTargetIndex] = useState<number | null>(null);
  const [hiddenSourceIndex, setHiddenSourceIndex] = useState<number | null>(null);
  const [showAllTargetLang, setShowAllTargetLang] = useState(false);
  const [calculatedImages, setCalculatedImages] = useState<ChapterImage[] | null>(null);
  const screenWidth = useScreenWidth();
  let imagesLanguage = sourceLang;

  // If chapter has no native images for source and target languages, then set the first ones
  if (!chapter.languages.map(lang => lang.toLowerCase()).includes(imagesLanguage)) {
    imagesLanguage = targetLang;

    if (!chapter.languages.map(lang => lang.toLowerCase()).includes(targetLang)) {
      imagesLanguage = chapter.languages[0].toLowerCase() as LocaleType;
    }
  }

  // Extract the images with imagesLanguage from the chapter
  const images = chapter.images.find(({language}) => language.toLowerCase() === imagesLanguage)?.images;

  useEffect(() => {
    if (!images) return;

    setCalculatedImages(images.map(image => {
      const scalingFactor = screenWidth < image.width ? screenWidth / image.width : 1;

      return {
        height: Math.round(image.height * scalingFactor),
        width: screenWidth > image.width ? image.width : screenWidth,
        src: image.src
      }
    }));
  }, [images, screenWidth]);

  if (!images) notFound();

  const averageImageWidth = images.reduce((acc, {width}) => acc + width, 0) / images.length;

  // Adjust metadata coordinates
  const adjustedMetadataContent = metadata?.flatMap((item) => {
    const scalingFactor = screenWidth < averageImageWidth ? screenWidth / averageImageWidth : 1;
    const languages = Object.keys(item.translatedTexts) as LocaleType[];
    const coordsLanguage = item.coords[imagesLanguage] ? imagesLanguage : Object.keys(item.coords)[0] as LocaleType;

    return {
      ...item,
      translatedTexts: languages.reduce((acc, lang) => ({
      ...acc,
      [lang]: {
        ...acc[lang],
        text: scaleFontSizes(acc[lang].text, scalingFactor),
        fontSize: (acc[lang].fontSize ?? 22) * scalingFactor
      }
    }), item.translatedTexts),
      coords: {
        x1: Math.round(item.coords[coordsLanguage].x1 * scalingFactor),
        y1: Math.round(item.coords[coordsLanguage].y1 * scalingFactor),
        x2: Math.round(item.coords[coordsLanguage].x2 * scalingFactor),
        y2: Math.round(item.coords[coordsLanguage].y2 * scalingFactor)
      }
    }
  })

  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      // Check if the click is inside a Card element
      const cardElement = (event.target as HTMLElement).closest(".card");
      if (!cardElement) {
        setActiveTargetIndex(null);
        setHiddenSourceIndex(null);
      }
    }

    document.body.addEventListener("click", onClick);

    return () => {
      document.body.removeEventListener("click", onClick);
    }
  }, []);

  return (
    <>
      <div className="overflow-hidden flex flex-col items-center min-h-screen">
        <div className="relative">
          {calculatedImages?.map((image, index) =>
            <NextImage
              key={image.src || index}
              src={BUCKET_URL + image.src}
              alt={image.src}
              priority={index < 2}
              loading={index >= 2 ? "lazy" : undefined}
              width={image.width}
              height={image.height}
              data-loaded='false'
              data-error='false'
              onLoad={event => {
                event.currentTarget.setAttribute('data-loaded', 'true')
              }}
              onError={event => {
                event.currentTarget.setAttribute('data-error', 'true');
                event.currentTarget.setAttribute('data-loaded', 'true')
              }}
              className='data-[loaded=false]:animate-pulse data-[loaded=false]:bg-gray-400/50 data-[error=true]:bg-red-400/50'
              style={{
                objectFit: 'contain',
                maxWidth: '100%',
                height: image.height || images[index].height
              }}
            />
          )}
          {imagesLanguage !== sourceLang && adjustedMetadataContent?.map((data, index) => {
            const width = (data.coords.x2 - data.coords.x1) + METADATA_BOX_PADDING * 2
            const height = (data.coords.y2 - data.coords.y1) + METADATA_BOX_PADDING * 2

            return (
              <Card
                key={index}
                className="absolute z-[19] transition-opacity duration-200 card light shadow-none overflow-visible rounded-[10em] text-center uppercase hyphens-auto"
                lang={sourceLang}
                style={{
                  opacity: showAllTargetLang ? hiddenSourceIndex === index ? 1 : 0 : hiddenSourceIndex === index ? 0 : 1,
                  left: `${data.coords.x1 - METADATA_BOX_PADDING}px`,
                  top: `${data.coords.y1 - METADATA_BOX_PADDING}px`,
                  width: `${width}px`,
                  minHeight: `${height}px`,
                  maxWidth: `${screenWidth}px`,
                  ...data.style,
                  ...fonts[data.style?.fontFamily as keyof typeof fonts ?? DEFAULT_CHAPTER_FONT_FAMILY]?.style // applying fonts
                }}
                onPress={() => {
                  if (imagesLanguage !== targetLang) return;
                  setHiddenSourceIndex(hiddenSourceIndex === index ? null : index);
                }}
                disableRipple
                isPressable={imagesLanguage === targetLang}
              >
                <CardBody
                  style={{textAlign: 'inherit'}}
                  className="h-full items-center justify-center overflow-visible"
                >
                  <ChapterMetadataText value={data.translatedTexts[sourceLang]}/>
                </CardBody>
              </Card>
            )
          })}
          {sourceLang !== targetLang // If the source and target languages are the same then don't display the metadata
            && targetLang !== imagesLanguage && adjustedMetadataContent?.map((data, index) => {
              const width = (data.coords.x2 - data.coords.x1) + METADATA_BOX_PADDING * 2
              const height = (data.coords.y2 - data.coords.y1) + METADATA_BOX_PADDING * 2

              return (
                <Card
                  key={index}
                  className="absolute z-[19] transition-opacity duration-200 card light shadow-none overflow-visible rounded-[10em] text-center uppercase hyphens-auto"
                  style={{
                    opacity: showAllTargetLang ? activeTargetIndex === index ? 0 : 1 : activeTargetIndex === index ? 1 : 0,
                    left: `${data.coords.x1 - METADATA_BOX_PADDING}px`,
                    top: `${data.coords.y1 - METADATA_BOX_PADDING}px`,
                    width: `${width}px`,
                    minHeight: `${height}px`,
                    ...data.style
                  }}
                  lang={targetLang}
                  isPressable
                  disableRipple
                  onPress={() => setActiveTargetIndex(activeTargetIndex === index ? null : index)}
                >
                  <CardBody
                    style={{textAlign: 'inherit'}}
                    className="h-full items-center justify-center overflow-visible"
                  >
                    <ChapterMetadataText value={data.translatedTexts[targetLang]}/>
                  </CardBody>
                </Card>
              )
            })}
        </div>
      </div>
      {metadata && targetLang !== sourceLang &&
          <Button
              isIconOnly
              className="fixed bottom-16 right-4 z-20 opacity-80"
              size="lg"
              radius="full"
              onPress={() => setShowAllTargetLang(prev => !prev)}
          >
              <motion.div
                  initial={{opacity: 0, rotate: 0}}
                  animate={{opacity: 1, rotate: showAllTargetLang ? 0 : 360}}
                  transition={{duration: 0.1}}
              >
                {showAllTargetLang
                  ? <TbLanguageOff size={28}/>
                  : <IoLanguage size={26}/>}
              </motion.div>
          </Button>
      }
      <LanguageSelectNavbar
        nativeLanguages={chapter.languages.map(lang => lang.toLowerCase()) as LocaleType[]}
        languages={locales}
      />
    </>
  )
}