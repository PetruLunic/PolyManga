"use client"

import { Box } from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState, useRef } from "react";
import { LocaleType } from "@/app/types";
import { locales } from "@/i18n/routing";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import useDebounce from "@/app/lib/hooks/useDebounce";
import {ColorPickerButton} from "@/app/_components/ColorPickerButton";
import ChapterMetadataText from "@/app/_components/ChapterMetadataText";
import TextEditor from "@/app/_components/TextEditor";
import { TbBackground } from "react-icons/tb";
import {IoColorPalette} from "react-icons/io5";
import hexToRgb from "@/app/lib/utils/hexToRgb";
import {FaAlignCenter, FaAlignLeft, FaAlignRight, FaBold, FaItalic} from "react-icons/fa";
import invertColor from "@/app/lib/utils/invertColor";
import {VscColorMode} from "react-icons/vsc";

const FONT_SIZES = Array.from({ length: 50 }, (_, index) => 10 + index * 2);
const OPACITY_VALUES = Array.from({ length: 11 }, (_, index) => index / 10);
const RADIUS_VALUES = Array.from({ length: 20 }, (_, index) => index + "em");
const GRADIENT_TURN_VALUES = Array.from({ length: 21 }, (_, index) => index / 20 + "turn");
type SettingTab = "background" | "text";

interface Props {
  box: Box;
  onSave: (id: string, language: LocaleType, text: string) => void;
  handleFontSizeChange: (id: string, languages: LocaleType[], fontSize: number) => void;
  onDelete: (id: string) => void;
  defaultTextLanguage: LocaleType;
  handleDragStop: RndDragCallback;
  handleResizeStop: RndResizeCallback;
  imagesLanguage: LocaleType;
  imageRef: HTMLImageElement | null;
  needsResize: boolean;
  onBoxChange: (id: string, newX1: number, newY1: number, newX2: number, newY2: number) => void;
  handleBoxStyleChange: (id: string, style: React.CSSProperties) => void;
  isFocused?: boolean | null;
  onPress?: () => void;
}

function EditableMetadataBox({
                               box,
                               onSave,
                               handleFontSizeChange,
                               onDelete,
                               defaultTextLanguage,
                               handleDragStop,
                               handleResizeStop,
                               imagesLanguage,
                               imageRef,
                               needsResize,
                               onBoxChange,
                               handleBoxStyleChange,
                               isFocused,
                               onPress
                             }: Props) {
  const [isMounted, setIsMounted] = useState(false);
  const [language, setLanguage] = useState<LocaleType>(defaultTextLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const fontSize = box.translatedTexts[language]?.fontSize;
  const coords = box.coords[imagesLanguage] ?? box.coords[Object.keys(box.coords)[0] as LocaleType];
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas
  const [boxStyle, setBoxStyle] = useState<React.CSSProperties>();
  const [activeTab, setActiveTab] = useState<SettingTab | null>(null);
  const debouncedBoxStyle = useDebounce(boxStyle, 200);
  const opacity = boxStyle?.backgroundColor?.split(",").at(-1)?.replace(")", "");
  const [gradient, setGradient] = useState({
    turn: boxStyle?.backgroundImage?.replace("linear-gradient(", "").split(",")[0],
    first: boxStyle?.backgroundImage?.split(",")[1],
    second:  boxStyle?.backgroundImage?.split(",")[2].replace(")", "")
  });

  useEffect(() => {
    setIsMounted(true);
  }, []);

  useEffect(() => {
    if (!gradient.first || !gradient.second) return;
    const turn = gradient.turn ?? "0.5turn";
    setBoxStyle(prev => ({
      ...prev,
      backgroundImage: `linear-gradient(${turn},${gradient.first},${gradient.second})`
    }))
  }, [gradient]);

  useEffect(() => {
    if (!debouncedBoxStyle) return;
    handleBoxStyleChange(box.id, debouncedBoxStyle);
  }, [debouncedBoxStyle]);

  useEffect(() => {
    setLanguage(defaultTextLanguage);
  }, [defaultTextLanguage]);

  useEffect(() => {
    setText(box.translatedTexts[language]?.text ?? "");
  }, [box.translatedTexts, language]);

  useEffect(() => {
    if (!needsResize) return;
    if (!isMounted || typeof window === 'undefined') return;

    // ---- Pre-checks ----
    if (!imageRef) {
      console.warn("EditableMetadataBox: imageRef is not yet assigned.");
      return;
    }
    const actualImageElement = imageRef; // Assuming imageRef is directly the HTMLImageElement

    console.log({actualImageElement})

    if (!(actualImageElement instanceof HTMLImageElement)) {
      console.warn("EditableMetadataBox: imageRef did not resolve to an HTMLImageElement.", actualImageElement);
      return;
    }

    const isImageLoaded = actualImageElement.getAttribute('data-loaded') === 'true';
    const hasImageError = actualImageElement.getAttribute('data-error') === 'true';

    if (hasImageError) {
      console.warn(`EditableMetadataBox: Image ${actualImageElement.src} has a loading error. Cannot resize box.`);
      return;
    }
    if (!isImageLoaded || actualImageElement.naturalWidth === 0) {
      console.warn(`EditableMetadataBox: Image ${actualImageElement.src} is not yet fully loaded.`);
      return;
    }
    if (!coords) {
      console.warn("EditableMetadataBox: Coords not available for resizing.");
      return;
    }

    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { willReadFrequently: true });
    if (!ctx) return;

    // ---- Coordinate Calculations & Canvas Setup ----
    const imageRect = actualImageElement.getBoundingClientRect();
    const CONTAINER_Y_OFFSET = 12; // Y position of parent container in the body
    const imageDocumentX = 0; // The images are on the left edge of the parent container
    const imageDocumentY = imageRect.top + window.scrollY - CONTAINER_Y_OFFSET;

    // Convert absolute box coordinates to be relative to the image's top-left corner
    const canvasRelativeX1 = coords.x1 - imageDocumentX;
    const canvasRelativeY1 = coords.y1 - imageDocumentY;
    const canvasRelativeX2 = coords.x2 - imageDocumentX;
    const canvasRelativeY2 = coords.y2 - imageDocumentY;

    canvas.width = actualImageElement.width;
    canvas.height = actualImageElement.height;

    try {
      // Clear the canvas before drawing (important if you're re-drawing)
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      // Draw the image onto the canvas (NO scaling here)
      ctx.drawImage(actualImageElement, 0, 0, canvas.width, canvas.height);
    } catch (e) {
      console.error("EditableMetadataBox: Error drawing image to canvas (CORS?):", actualImageElement.src, e);
      return;
    }

    // Initialize new canvas-relative coordinates to the midpoint initially
    let newCRX1 = canvasRelativeX1; // cr = Canvas Relative
    let newCRY1 = canvasRelativeY1;
    let newCRX2 = canvasRelativeX2;
    let newCRY2 = canvasRelativeY2;
    const STEP = 5; // Iteration step
    const COLOR_TOLERANCE = 10;
    const MAX_RESIZE_LIMIT = 50; // How much can resize any of the box coords
    const NUMBER_OF_SEGMENTS = 7; // The number of evenly divided segments that checks color change

    // --- Calculate Scan Lines based on NUMBER_OF_SEGMENTS ---
    const boxWidthCanvas = canvasRelativeX2 - canvasRelativeX1;
    const boxHeightCanvas = canvasRelativeY2 - canvasRelativeY1;

    // yScanCoords are absolute Y positions on the canvas for horizontal scans
    const yScanOffsets = calculateSegmentPoints(boxHeightCanvas, NUMBER_OF_SEGMENTS);
    const yScanCoords = yScanOffsets.map(offset => Math.floor(canvasRelativeY1 + offset));
    if (yScanCoords.length === 0 && boxHeightCanvas > 0) { // Fallback for no segments but valid height
      yScanCoords.push(Math.floor(canvasRelativeY1 + boxHeightCanvas / 2));
    }

    // xScanCoords are absolute X positions on the canvas for vertical scans
    const xScanOffsets = calculateSegmentPoints(boxWidthCanvas, NUMBER_OF_SEGMENTS);
    const xScanCoords = xScanOffsets.map(offset => Math.floor(canvasRelativeX1 + offset));
    if (xScanCoords.length === 0 && boxWidthCanvas > 0) { // Fallback for no segments but valid width
      xScanCoords.push(Math.floor(canvasRelativeX1 + boxWidthCanvas / 2));
    }

    // --- Iteration Logic: Expand from the initial box's midpoint ---

    // Iterate Right: Find newCRX2
    let tempNewCRX2: number | null = null; // Start with original right edge
    for (const scanY of yScanCoords) {
      if (scanY < 0 || scanY >= canvas.height) continue; // Skip if scan line is off canvas

      const startX = Math.floor(canvasRelativeX2);
      if (startX < 0 || startX >= canvas.width) continue;

      const initialColor = getPixelColor(ctx, startX, scanY);
      if (initialColor[3] === 0) {
        console.warn(`Skipping right scan at Y=${scanY} due to transparent initial color`);
        continue;
      }

      let currentEdgeX = startX;
      const limitX = Math.min(canvas.width -1 , startX + MAX_RESIZE_LIMIT);

      for (let x = startX; x <= limitX; x += STEP) {
        const currentColor = getPixelColor(ctx, x, scanY);
        if (isSameColor(initialColor, currentColor, COLOR_TOLERANCE)) {
          currentEdgeX = x;
        } else {
          break;
        }
      }

      if (tempNewCRX2) {
        tempNewCRX2 = Math.min(tempNewCRX2, currentEdgeX); // Expand to the nearest found edge
      } else {
        tempNewCRX2 = currentEdgeX;
      }
    }
    newCRX2 = tempNewCRX2 ?? canvasRelativeX2;

    // Iterate Left: Find newCRX1
    let tempNewCRX1: number | null = null; // Start with original left edge
    for (const scanY of yScanCoords) {
      if (scanY < 0 || scanY >= canvas.height) continue;

      const startX = Math.floor(canvasRelativeX1);
      if (startX < 0 || startX >= canvas.width) continue;

      const initialColor = getPixelColor(ctx, startX, scanY);
      if (initialColor[3] === 0) {
        console.warn(`Skipping left scan at Y=${scanY} due to transparent initial color`);
        continue;
      }

      let currentEdgeX = startX;
      const limitX = Math.max(0, startX - MAX_RESIZE_LIMIT);

      for (let x = startX; x >= limitX; x -= STEP) {
        const currentColor = getPixelColor(ctx, x, scanY);
        if (isSameColor(initialColor, currentColor, COLOR_TOLERANCE)) {
          currentEdgeX = x;
        } else {
          break;
        }
      }

      if (tempNewCRX1) {
        tempNewCRX1 = Math.max(tempNewCRX1, currentEdgeX); // Contract to the nearest found edge
      } else {
        tempNewCRX1 = currentEdgeX;
      }
    }
    newCRX1 = tempNewCRX1 ?? canvasRelativeX1;

    // Iterate Down: Find newCRY2
    let tempNewCRY2: number | null = null; // Start with original bottom edge
    for (const scanX of xScanCoords) {
      if (scanX < 0 || scanX >= canvas.width) continue;

      const startY = Math.floor(canvasRelativeY2);
      if (startY < 0 || startY >= canvas.height) continue;

      const initialColor = getPixelColor(ctx, scanX, startY);
      if (initialColor[3] === 0) {
        console.warn(`Skipping down scan at X=${scanX} due to transparent initial color`);
        continue;
      }

      let currentEdgeY = startY;
      const limitY = Math.min(canvas.height - 1, startY + MAX_RESIZE_LIMIT);

      for (let y = startY; y <= limitY; y += STEP) {
        const currentColor = getPixelColor(ctx, scanX, y);
        if (isSameColor(initialColor, currentColor, COLOR_TOLERANCE)) {
          currentEdgeY = y;
        } else {
          break;
        }
      }

      if (tempNewCRY2) {
        tempNewCRY2 = Math.min(tempNewCRY2, currentEdgeY);
      } else {
        tempNewCRY2 = currentEdgeY
      }
    }
    newCRY2 = tempNewCRY2 ?? canvasRelativeY2;

    // Iterate Up: Find newCRY1
    let tempNewCRY1 = 0; // Start with original top edge
    for (const scanX of xScanCoords) {
      if (scanX < 0 || scanX >= canvas.width) continue;

      const startY = Math.floor(canvasRelativeY1);
      if (startY < 0 || startY >= canvas.height) continue;

      const initialColor = getPixelColor(ctx, scanX, startY);
      if (initialColor[3] === 0) {
        console.warn(`Skipping up scan at X=${scanX} due to transparent initial color`);
        continue;
      }

      let currentEdgeY = startY;
      const limitY = Math.max(0, startY - MAX_RESIZE_LIMIT);

      for (let y = startY; y >= limitY; y -= STEP) {
        const currentColor = getPixelColor(ctx, scanX, y);
        if (isSameColor(initialColor, currentColor, COLOR_TOLERANCE)) {
          currentEdgeY = y;
        } else {
          break;
        }
      }

      if (tempNewCRY1) {
        tempNewCRY1 = Math.max(tempNewCRY1, currentEdgeY);
      } else {
        tempNewCRY1 = currentEdgeY
      }
    }
    newCRY1 = tempNewCRY1 ?? canvasRelativeY1;

    // ---- Convert new canvas-relative coordinates back to absolute document coordinates ----
    const finalNewX1 = newCRX1 + imageDocumentX;
    const finalNewY1 = newCRY1 + imageDocumentY;
    const finalNewX2 = newCRX2 + imageDocumentX;
    const finalNewY2 = newCRY2 + imageDocumentY;

    onBoxChange(box.id, finalNewX1, finalNewY1, finalNewX2, finalNewY2);

  }, [needsResize]);

  const calculateSegmentPoints = (length: number, numberOfSegments: number): number[] => {
    if (numberOfSegments <= 0 || length <= 0) {
      return [];
    }
    const points: number[] = [];
    // For N segments, we divide the length into N+1 parts and pick N points
    // This creates N evenly spaced points, excluding corners
    for (let i = 1; i <= numberOfSegments; i++) {
      points.push(length * (i / (numberOfSegments + 1)));
    }
    return points;
  };

  const getPixelColor = (ctx: CanvasRenderingContext2D, x: number, y: number): number[] => {
    const pixelData = ctx.getImageData(x, y, 3, 3).data;
    return [pixelData[0], pixelData[1], pixelData[2], pixelData[3]]; // RGBA
  };

  const isSameColor = (color1: number[], color2: number[], tolerance: number = 0): boolean => {
    // Ensure both colors have the same number of channels (e.g., RGB or RGBA)
    if (color1.length !== color2.length) {
      console.warn("isSameColor: Color arrays have different lengths.", color1, color2);
      return false;
    }

    // Iterate over each color channel (R, G, B, and possibly A)
    for (let i = 0; i < color1.length; i++) {
      // Calculate the absolute difference between the channel values
      const difference = Math.abs(color1[i] - color2[i]);

      // If the difference exceeds the tolerance, the colors are not considered the same
      if (difference > tolerance) {
        return false;
      }
    }

    // If all channel differences are within the tolerance, the colors are considered the same
    return true;
  };

  const handleSettingTabPress = (tab: SettingTab) => () => {
    if (tab === activeTab) {
      setActiveTab(null);
    } else {
      setActiveTab(tab);
    }
  }

  if (!coords) return null;

  return (
      <>
        <canvas ref={canvasRef} style={{ display: "none" }} /> {/* Hidden canvas */}
        <Rnd
            bounds="parent"
            className="z-50 border-1 border-black border-solid"
            style={{
              borderColor: invertColor(box.style?.backgroundColor ?? "#fff")
            }}
            size={{
              width: coords.x2 - coords.x1,
              height: coords.y2 - coords.y1,
            }}
            position={{ x: coords.x1, y: coords.y1 }}
            disableDragging={isEditing}
            onDragStop={handleDragStop}
            onResizeStop={handleResizeStop}
            data-id={box.id} // Pass the ID as a custom attribute for identification
        >
          <Card
              className="relative light min-w-full min-h-full overflow-visible rounded-[10em] shadow-none text-center uppercase hyphens-auto"
              lang={language}
              style={box.style}
              data-id={box.id}
          >
            <CardBody
                style={{textAlign: 'inherit'}}
                onClick={onPress}
                className="h-full items-center justify-center overflow-visible"
            >
              {isEditing ? (
                  <TextEditor
                      value={text}
                      onValueChange={setText}
                      className="bg-white h-full w-full rounded-3xl"
                  />
              ) : (
                  <ChapterMetadataText value={box.translatedTexts[language]} />
              )}
            </CardBody>
          </Card>
          {isFocused && (
              <div className="absolute right-[-10px] -translate-y-full translate-x-full flex gap-2 opacity-90">
                <div className="flex flex-col gap-1 min-w-36 max-w-44">
                  <Button
                      startContent={<TbBackground/>}
                      size="sm"
                      color={activeTab === "background" ? "primary" : "default"}
                      onPress={handleSettingTabPress("background")}
                  >
                    Background
                  </Button>
                  <div className="flex justify-between">
                    <Button
                        isIconOnly
                        onPress={() => {
                          setBoxStyle(prev => ({
                            ...prev,
                            textAlign: "left"
                          }))
                        }}
                    >
                      <FaAlignLeft/>
                    </Button>
                    <Button
                        isIconOnly
                        onPress={() => {
                          setBoxStyle(prev => ({
                            ...prev,
                            textAlign: "center"
                          }))
                        }}
                    >
                      <FaAlignCenter/>
                    </Button>
                    <Button
                        isIconOnly
                        onPress={() => {
                          setBoxStyle(prev => ({
                            ...prev,
                            textAlign: "right"
                          }))
                        }}
                    >
                      <FaAlignRight/>
                    </Button>
                  </div>
                  <div className="flex justify-between">
                    <Button
                        isIconOnly
                        color={box.style?.fontWeight === "bolder" ? "primary" : "default"}
                        onPress={() => {
                          setBoxStyle(prev => ({
                            ...prev,
                            fontWeight: box.style?.fontWeight === "bolder" ? "normal" : "bolder"
                          }))
                        }}
                    >
                      <FaBold/>
                    </Button>
                    <Button
                        isIconOnly
                        color={box.style?.fontStyle === "italic" ? "primary" : "default"}
                        onPress={() => {
                          setBoxStyle(prev => ({
                            ...prev,
                            fontStyle: box.style?.fontStyle === "italic" ? "normal" : "italic"
                          }))
                        }}
                    >
                      <FaItalic/>
                    </Button>
                    <ColorPickerButton
                        isIconOnly
                        value={box.style?.color}
                        onChange={(value) => {
                          setBoxStyle(prev => ({
                            ...prev,
                            color: value
                          }))
                        }}
                    >
                      <IoColorPalette/>
                    </ColorPickerButton>
                  </div>
                  <Select
                      selectedKeys={[language]}
                      disallowEmptySelection
                      label="Language"
                      size="sm"
                      onSelectionChange={(keys) => {
                        setLanguage((keys.currentKey ?? "en") as LocaleType);
                      }}
                  >
                    {locales.map((lang) => (
                        <SelectItem key={lang}>{lang}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex gap-1">
                    <Select
                        selectedKeys={fontSize ? [fontSize.toString()] : ["32"]}
                        disallowEmptySelection
                        label={`all`}
                        size="sm"
                        onSelectionChange={(keys) => {
                          handleFontSizeChange(box.id, Object.keys(box.translatedTexts) as LocaleType[], Number.parseInt(keys.currentKey ?? "32"));
                        }}
                    >
                      {FONT_SIZES.map((number) => (
                          <SelectItem key={number}>{number.toString()}</SelectItem>
                      ))}
                    </Select>
                    <Select
                        selectedKeys={fontSize ? [fontSize.toString()] : ["32"]}
                        disallowEmptySelection
                        label={`${language}`}
                        size="sm"
                        onSelectionChange={(keys) => {
                          handleFontSizeChange(box.id, [language], Number.parseInt(keys.currentKey ?? "32"));
                        }}
                    >
                      {FONT_SIZES.map((number) => (
                          <SelectItem key={number}>{number.toString()}</SelectItem>
                      ))}
                    </Select>
                  </div>
                  {!isEditing ? (
                      <Button
                          size="sm"
                          onPress={() => setIsEditing(true)}
                      >
                        Edit
                      </Button>
                  ) : (
                      <>
                        <Button
                            color="success"
                            onPress={() => {
                              setIsEditing(false);
                              onSave(box.id, language, text || "Empty");
                            }}
                            size="sm"
                        >
                          Save
                        </Button>
                        <Button
                            color="danger"
                            onPress={() => {
                              setIsEditing(false);
                              setText(box.translatedTexts[language]?.text ?? "");
                            }}
                            size="sm"
                        >
                          Cancel
                        </Button>
                      </>
                  )}
                  <Button
                      color="danger"
                      onPress={() => onDelete(box.id)}
                      size="sm"
                  >
                    Delete
                  </Button>
                </div>
                {/* ------- Setting tabs --------*/}
                {activeTab === "background" && <div className="flex flex-col gap-1 min-w-36">
                  <ColorPickerButton
                      startContent={<IoColorPalette/>}
                      size="sm"
                      value={box.style?.backgroundColor}
                      onChange={value => setBoxStyle(prev => ({
                        ...prev,
                        backgroundColor: value
                      }))}>
                    Pick Color
                  </ColorPickerButton>
                  <Select
                      selectedKeys={opacity ? [opacity] : ["1"]}
                      disallowEmptySelection
                      label="Opacity"
                      size="sm"
                      onSelectionChange={(keys) => {
                        const key = keys.currentKey;
                        if (!key) return;

                        const prev = box.style;
                        setBoxStyle(() => {
                          // If has color then append the opacity else to create new white color with opacity
                          if (prev?.backgroundColor) {
                            const rgbColor = hexToRgb(prev?.backgroundColor);

                            if (!rgbColor) {
                              if (opacity) { // replace opacity
                                let newColor = prev.backgroundColor.split(",");
                                newColor.pop();

                                return {
                                  ...prev,
                                  backgroundColor: newColor.concat(`${key})`).join(",")
                                }
                              }

                              return {
                                ...prev,
                                backgroundColor: prev.backgroundColor.replace(")", "").concat(`,${key})`)
                              }
                            }

                            return {
                              ...prev,
                              backgroundColor: `rgba(${rgbColor.r},${rgbColor.g},${rgbColor.b},${key})`
                            }
                          } else {
                            return {
                              ...prev,
                              backgroundColor: `rgba(255,255,255,${key})`
                            }
                          }
                        })
                      }}
                  >
                    {OPACITY_VALUES.map((number) => (
                        <SelectItem key={number}>{number.toString()}</SelectItem>
                    ))}
                  </Select>
                  <Select
                      selectedKeys={box.style?.borderRadius ? [box.style?.borderRadius.toString()] : ["10em"]}
                      disallowEmptySelection
                      label={`Radius`}
                      size="sm"
                      onSelectionChange={(keys) => {
                        const key = keys.currentKey;
                        if (!key) return;

                        setBoxStyle(prev => ({
                          ...prev,
                          borderRadius: key
                        }))
                      }}
                  >
                    {RADIUS_VALUES.map((number) => (
                        <SelectItem key={number}>{number.toString()}</SelectItem>
                    ))}
                  </Select>
                  <Button
                      startContent={<VscColorMode/>}
                      size="sm"
                      onPress={() => setBoxStyle(prev => ({
                        ...prev,
                        backgroundColor: invertColor(box.style?.backgroundColor ?? "rgb(255,255,255)")
                      }))}>
                    Inverse Color
                  </Button>
                  <Select
                      selectedKeys={[gradient.turn ?? 0]}
                      label={`Turn`}
                      size="sm"
                      onSelectionChange={(keys) => {
                        const key = keys.currentKey;
                        if (!key) return;

                        setGradient(prev => ({
                          ...prev,
                          turn: key
                        }))
                      }}
                  >
                    {GRADIENT_TURN_VALUES.map((number) => (
                        <SelectItem key={number}>{number.replace("turn", "")}</SelectItem>
                    ))}
                  </Select>
                  <div className="flex">
                    <ColorPickerButton
                        value={gradient.first}
                        onChange={value => setGradient(prev => ({
                          ...prev,
                          first: value
                        }))}>
                      <IoColorPalette/>
                    </ColorPickerButton>
                    <ColorPickerButton
                        value={gradient.second}
                        onChange={value => setGradient(prev => ({
                          ...prev,
                          second: value
                        }))}>
                      <IoColorPalette/>
                    </ColorPickerButton>
                  </div>
                </div>}
              </div>
          )}
        </Rnd>
      </>
  );
}

export default React.memo(
    EditableMetadataBox,
    (prevProps, nextProps) => {
      return (
          prevProps.box.id === nextProps.box.id &&
          prevProps.box.coords === nextProps.box.coords &&
          prevProps.box.translatedTexts === nextProps.box.translatedTexts &&
          prevProps.box.style === nextProps.box.style &&
          prevProps.imagesLanguage === nextProps.imagesLanguage &&
          prevProps.defaultTextLanguage === nextProps.defaultTextLanguage &&
          prevProps.imageRef === nextProps.imageRef &&
          prevProps.needsResize === nextProps.needsResize &&
          prevProps.isFocused === nextProps.isFocused
      );
    }
);