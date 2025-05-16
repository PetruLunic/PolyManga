import { Box } from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import { Button, Card, CardBody, Select, SelectItem } from "@heroui/react";
import React, { useEffect, useState, useRef, useCallback } from "react";
import { LocaleType } from "@/app/types";
import { locales } from "@/i18n/routing";
import { Rnd, RndDragCallback, RndResizeCallback } from "react-rnd";
import { Textarea } from "@heroui/input";
import wildWords from "@/app/lib/fonts/WildWords";
import useDebounce from "@/app/lib/hooks/useDebounce";
import {ColorPickerButton} from "@/app/_components/ColorPickerButton";

const FONT_SIZES = Array.from({ length: 30 }, (_, index) => 10 + index * 2);

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
                               handleBoxStyleChange
                             }: Props) {
  const [language, setLanguage] = useState<LocaleType>(defaultTextLanguage);
  const [isEditing, setIsEditing] = useState(false);
  const [text, setText] = useState("");
  const fontSize = box.translatedTexts[language]?.fontSize;
  const coords = box.coords[imagesLanguage] ?? box.coords[Object.keys(box.coords)[0] as LocaleType];
  const canvasRef = useRef<HTMLCanvasElement>(null); // Ref for the canvas
  const [boxStyle, setBoxStyle] = useState<React.CSSProperties>();
  const debouncedBoxStyle = useDebounce(boxStyle, 200);

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

  // Inside EditableMetadataBox.tsx

  useEffect(() => {
    if (!needsResize) return;

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
    //
    // console.log({
    //   imageSrc: actualImageElement.src,
    //   initialBoxMidCanvas: { x: xScanCoords, y: yScanCoords },
    //   oldAbs: { x1: coords.x1, y1: coords.y1, x2: coords.x2, y2: coords.y2 },
    //   newCanvasRel: { x1: newCRX1, y1: newCRY1, x2: newCRX2, y2: newCRY2 },
    //   newAbs: { x1: finalNewX1, y1: finalNewY1, x2: finalNewX2, y2: finalNewY2 }
    // });

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


  if (!coords) return null;

  console.log(JSON.stringify(box.style));

  return (
    <>
      <canvas ref={canvasRef} style={{ display: "none" }} /> {/* Hidden canvas */}
      <Rnd
        bounds="parent"
        className="z-50 border-1 border-black border-solid"
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
          className="relative light min-w-full min-h-full overflow-visible rounded-[10em] shadow-none"
          style={box.style}
          data-id={box.id}
        >
          <CardBody
            className="h-full items-center justify-center"
          >
            {isEditing ? (
              <Textarea
                isClearable
                value={text}
                onValueChange={setText}
              />
            ) : (
              <div
                className={`relative text-center ${wildWords.className}`}
                style={{
                  fontSize: box.translatedTexts[language]?.fontSize ?? 32,
                  lineHeight: 1.25,
                }}
              >
                <div
                  className={`
                  relative 
                  [-webkit-text-stroke:0.2em_white]
                  z-[60]
                  text-balance
                  whitespace-pre-line
                  before:text-balance
                  before:z-[60]
                  before:content-[attr(data-content)]
                  before:absolute
                  before:whitespace-pre-line
                  before:inset-0 
                  before:text-black 
                  before:[-webkit-text-fill-color:black] 
                  before:[-webkit-text-stroke:0]
                  `}
                  data-content={box.translatedTexts[language]?.text}
                >
                  {box.translatedTexts[language]?.text}
                </div>
              </div>
            )}
          </CardBody>
        </Card>
        <div className="absolute right-[-10px] -translate-y-full translate-x-full flex flex-col gap-1 min-w-28 opacity-90">
          <ColorPickerButton
            size="sm"
            value={box.style?.backgroundColor}
            onChange={value => setBoxStyle(prev => ({
              ...prev,
              backgroundColor: value
            }))}>
            Pick Color
          </ColorPickerButton>
          <Button
            onPress={() => {
              onSave(box.id, language, text.toUpperCase() || "Empty");
            }}
            size="sm"
          >
            Upper Case
          </Button>
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
          <Select
            selectedKeys={fontSize ? [fontSize.toString()] : ["32"]}
            disallowEmptySelection
            label={`All font size`}
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
            label={`${language} font size`}
            size="sm"
            onSelectionChange={(keys) => {
              handleFontSizeChange(box.id, [language], Number.parseInt(keys.currentKey ?? "32"));
            }}
          >
            {FONT_SIZES.map((number) => (
              <SelectItem key={number}>{number.toString()}</SelectItem>
            ))}
          </Select>
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
      prevProps.needsResize === nextProps.needsResize
    );
  }
);
