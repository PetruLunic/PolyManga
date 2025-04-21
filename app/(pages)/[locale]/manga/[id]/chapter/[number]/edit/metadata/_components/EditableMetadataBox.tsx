import {Box} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import {Button, Card, CardBody, Select, SelectItem} from "@heroui/react";
import React, {useEffect, useState} from "react";
import {LocaleType} from "@/app/types";
import {locales} from "@/i18n/routing";
import {Rnd, RndDragCallback, RndResizeCallback} from "react-rnd";
import {Textarea} from "@heroui/input";
import wildWords from "@/app/lib/fonts/WildWords";

const FONT_SIZES = Array.from({length: 30}, (_, index) => 10 + index * 2);

interface Props {
  box: Box;
  onSave: (id: string, language: LocaleType, text: string) => void;
  handleFontSizeChange: (id: string, languages: LocaleType[], fontSize: number) => void;
  onDelete: (id: string) => void;
  defaultTextLanguage: LocaleType;
  handleDragStop: RndDragCallback;
  handleResizeStop: RndResizeCallback;
  imagesLanguage: LocaleType;
}

function EditableMetadataBox({
    box,
    onSave,
    handleFontSizeChange,
    onDelete,
    defaultTextLanguage,
    handleDragStop,
    handleResizeStop,
    imagesLanguage
  }: Props) {
  const [language, setLanguage] = useState<LocaleType>(defaultTextLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const fontSize = box.translatedTexts[language]?.fontSize;
  const coords = box.coords[imagesLanguage] ?? box.coords[Object.keys(box.coords)[0] as LocaleType]

  useEffect(() => {
    setLanguage(defaultTextLanguage);
  }, [defaultTextLanguage]);

  useEffect(() => {
    setText(box.translatedTexts[language]?.text ?? "");
  }, [box.translatedTexts, language]);

  if (!coords) return;

  return (
    <>
      <Rnd
        bounds="parent"
        className="z-50"
        size={{
          width: coords.x2 - coords.x1,
          height: coords.y2 - coords.y1,
        }}
        position={{x: coords.x1, y: coords.y1}}
        disableDragging={isEditing}
        onDragStop={handleDragStop}
        onResizeStop={handleResizeStop}
        data-id={box.id} // Pass the ID as a custom attribute for identification
      >
        <Card
          className="relative light min-w-full min-h-full overflow-visible rounded-[10em] shadow-none"
          data-id={box.id}
        >
          <CardBody className="h-full items-center justify-center">
            {isEditing ? (
              <Textarea
                isClearable
                value={text}
                onValueChange={setText}
                variant="bordered"
              />
            ) : (
              <div
                className={`relative text-center ${wildWords.className}`}
                style={{
                   fontSize: box.translatedTexts[language]?.fontSize ?? 16,
                   lineHeight: 1.25
                 }}
              >
                <div
                  className={`
                  relative 
                  [-webkit-text-stroke:0.2em_white]
                  before:content-[attr(data-content)]
                  before:absolute
                  before:inset-0 
                  before:text-black 
                  before:[-webkit-text-fill-color:black] 
                  before:[-webkit-text-stroke:0]
                  `}
                  data-content={box.translatedTexts[language]?.text}>
                  {box.translatedTexts[language]?.text}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        <div className="absolute right-[-10px] -translate-y-full translate-x-full flex flex-col gap-1 min-w-28">
          <Button
            onPress={() => {
              onSave(box.id, language, text.toUpperCase() || "Empty");
            }}
          >
            Upper Case
          </Button>
          <Select
            selectedKeys={[language]}
            disallowEmptySelection
            label="Language"
            size="sm"
            onSelectionChange={keys => {
              setLanguage((keys.currentKey ?? "en") as LocaleType);
            }}
          >
            {locales.map(lang => (
              <SelectItem key={lang}>{lang}</SelectItem>
            ))}
          </Select>
          <Select
            selectedKeys={fontSize ? [fontSize.toString()] : ["16"]}
            disallowEmptySelection
            label={`All font size`}
            size="sm"
            onSelectionChange={keys => {
              handleFontSizeChange(box.id, Object.keys(box.translatedTexts) as LocaleType[], Number.parseInt(keys.currentKey ?? "16"))
            }}
          >
            {FONT_SIZES.map(number => (
              <SelectItem key={number}>{number.toString()}</SelectItem>
            ))}
          </Select>
          <Select
            selectedKeys={fontSize ? [fontSize.toString()] : ["16"]}
            disallowEmptySelection
            label={`${language} font size`}
            size="sm"
            onSelectionChange={keys => {
              handleFontSizeChange(box.id, [language], Number.parseInt(keys.currentKey ?? "16"))
            }}
          >
            {FONT_SIZES.map(number => (
              <SelectItem key={number}>{number.toString()}</SelectItem>
            ))}
          </Select>
          {!isEditing ? (
            <Button onPress={() => setIsEditing(true)}>Edit</Button>
          ) : (
            <>
              <Button
                color="success"
                onPress={() => {
                  setIsEditing(false);
                  onSave(box.id, language, text || "Empty");
                }}
              >
                Save
              </Button>
              <Button
                color="danger"
                onPress={() => {
                  setIsEditing(false);
                  setText(box.translatedTexts[language]?.text ?? "");
                }}
              >
                Cancel
              </Button>
            </>
          )}
          <Button color="danger" onPress={() => onDelete(box.id)}>
            Delete
          </Button>
        </div>
      </Rnd>
    </>
  );
}

export default React.memo(EditableMetadataBox, (prevProps, nextProps) => {
  return prevProps.box.id === nextProps.box.id &&
    prevProps.box.coords === nextProps.box.coords &&
    prevProps.box.translatedTexts === nextProps.box.translatedTexts &&
    prevProps.imagesLanguage === nextProps.imagesLanguage &&
    prevProps.defaultTextLanguage === nextProps.defaultTextLanguage;
})