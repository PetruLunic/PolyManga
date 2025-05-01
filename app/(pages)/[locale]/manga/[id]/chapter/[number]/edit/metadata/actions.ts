"use server"

import {LocaleEnum, LocaleType} from "@/app/types";
import dbConnect from "@/app/lib/utils/dbConnect";
import {ContentItemRaw} from "@/app/lib/graphql/schema";
import ChapterMetadataModel from "@/app/lib/models/ChapterMetadata";
import {Box} from "@/app/(pages)/[locale]/manga/[id]/chapter/[number]/edit/metadata/_components/RedactorPage";
import {auth} from "@/auth";
import Chapter from "@/app/lib/models/Chapter";
import {
  Content,
  GenerationConfig,
  FunctionDeclaration,
  Schema,
  Type,
  SafetySetting,
  HarmCategory,
  HarmBlockThreshold, GenerateContentConfig
} from "@google/genai";
import {geminiModel} from "@/app/lib/AIModels";


export async function saveMetadata (metadataContent: Box[], chapterId: string) {
  await dbConnect();
  const session = await auth();

  if (!session || session.user.role !== "ADMIN" && session.user.role !== "MODERATOR") {
    throw new Error("Unauthorized access");
  }

  const rawContent: ContentItemRaw[] = metadataContent.map(item => ({
    translatedTexts: Object.entries(item.translatedTexts).map(([language, text]) => ({
      language: language as LocaleEnum,
      text: text?.text?.toUpperCase() || "Empty text",
      fontSize: text.fontSize ?? 26
    })),
    coords: Object.entries(item.coords).map(([language, coord]) => ({
      language: language as LocaleEnum,
      coord: {
        x1: coord.x1,
        y1: coord.y1,
        x2: coord.x2,
        y2: coord.y2
      }
    }))
  }))
    // Sort by the y1 position of the element in ascending order
    .sort((a, b) => {
      const minY1A = Math.min(...a.coords.map(c => c.coord.y1));
      const minY1B = Math.min(...b.coords.map(c => c.coord.y1));
      return minY1A - minY1B;
    });

  const existingMetadata = await ChapterMetadataModel.findOne({chapterId});

  // Edit the existing metadata or create new one of there wasn't
  if (existingMetadata) {
    existingMetadata.content = rawContent;
    await existingMetadata.save();
  } else {
    const newMetadata = new ChapterMetadataModel({
      chapterId,
      content: rawContent
    });
    await newMetadata.save();
  }
}

const BUCKET_URL = process.env.NEXT_PUBLIC_BUCKET_URL;
const API_URL = process.env.OCR_API_URL;
const API_TOKEN = process.env.OCR_API_TOKEN;

export async function scanOCR(id: string, language: LocaleType) {
  if (!BUCKET_URL) throw new Error("No BUCKET_URL specified");
  if (!API_URL) throw new Error("No API_URL specified");
  if (!API_TOKEN) throw new Error("No API_TOKEN specified");

  const chapter = await Chapter.findOne({id}).lean();
  if (!chapter) throw new Error(`Chapter ${id} not found`);

  const images = chapter.versions.find(({language: lang}) => lang.toLowerCase() === language)?.images;
  if (!images) throw new Error(`Images not found for language ${language} chapter ${id}`);

  const imagesUrls = images.map(img => BUCKET_URL + img.src);

  const response = await fetch(API_URL + '/save-data', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_TOKEN.toString()
    },
    body: JSON.stringify({
      chapterId: id,
      data: imagesUrls
    })
  })

  const result = await response.json();
}

function cleanAIJsonResponse(response: string): any | null {
  if (!response) return null;
  let cleaned = response;

  // Remove markdown code block syntax
  cleaned = cleaned.replace(/```json/, '');
  cleaned = cleaned.replace(/```/g, '');

  // Remove potential prefixes like "0:" or "1:E"
  cleaned = cleaned.replace(/^\d+:/, '');
  cleaned = cleaned.replace(/^\d+[A-Z]:/, '');

  // Trim whitespace
  cleaned = cleaned.trim();

  try {
    // First attempt: direct parse
    return JSON.parse(cleaned);
  } catch (error) {
    console.error('First parsing attempt failed:', error);

    // Second attempt: apply fixes for common JSON issues
    try {
      let fixedJson = cleaned;

      // Fix escaping issues
      fixedJson = fixedJson
        .replace(/\\"/g, '"')         // Replace escaped quotes
        .replace(/\\\\/g, '\\')       // Fix double escapes
        .replace(/\\n/g, '\n');       // Replace escaped newlines

      // Try to fix unterminated strings by finding and closing unclosed quotes
      fixedJson = repairUnterminatedStrings(fixedJson);

      // Fix array issues by repairing missing commas and brackets
      fixedJson = repairArrayFormatting(fixedJson);

      return JSON.parse(fixedJson);
    } catch (secondError) {
      console.error('Second parsing attempt failed:', secondError);

      // Third attempt: more aggressive cleaning with regex-based JSON repair
      try {
        const manuallyRepairedJson = manualJsonRepair(cleaned);
        return JSON.parse(manuallyRepairedJson);
      } catch (thirdError) {
        console.error('All parsing attempts failed:', thirdError);
        throw thirdError;
      }
    }
  }
}

function repairUnterminatedStrings(json: string): string {
  // Find positions of all quotes (ignoring escaped quotes)
  let pos = 0;
  let inString = false;

  while (pos < json.length) {
    // Skip escaped quotes
    if (json[pos] === '\\' && pos + 1 < json.length) {
      pos += 2;
      continue;
    }

    if (json[pos] === '"') {
      inString = !inString;
    }

    pos++;
  }

  // If we end with an open string, close it
  if (inString) {
    return json + '"';
  }

  return json;
}

function repairArrayFormatting(json: string): string {
  // Check for missing commas between array elements (common when list items are on separate lines)
  let result = json.replace(/\]\s*\[/g, '],[');

  // Check for missing commas between string elements
  result = result.replace(/"(?:\s*)\](?:\s*)\[(?:\s*)"/g, '","');

  // Check for missing closing brackets at the end
  const openBrackets = (result.match(/\[/g) || []).length;
  const closeBrackets = (result.match(/\]/g) || []).length;

  if (openBrackets > closeBrackets) {
    result += ']'.repeat(openBrackets - closeBrackets);
  }

  return result;
}

function manualJsonRepair(json: string): string {
  // If it appears to be an array of strings, try to manually extract and repair them
  if (json.trim().startsWith('[') && json.includes('"')) {
    // Extract all strings within quotes
    const stringMatches = json.match(/"([^"\\]*(\\.[^"\\]*)*)"/g) || [];

    // Rebuild the array with proper formatting
    return '[' + stringMatches.join(',') + ']';
  }

  return json;
}

export async function translateWithGemini(
  originalTexts: string[],
  sourceLang: LocaleType,
  targetLang: LocaleType
 ): Promise<string[]>  {

  const systemInstruction: Content = {
    parts: [{
      text: `COMIC LOCALIZATION ENGINEER. Translate the provided JSON array of sequential comic panel texts from ${sourceLang} to ${targetLang}. Follow these rules precisely:
      1.  **Sequential Context:** Maintain narrative flow, character relationships, and plot progression *between* consecutive strings in the input array. Treat the array as panels in order.
      2.  **Tone Detection:** Adapt tone based on implicit cues (e.g., exclamation points for dialogue excitement, lack of quotes for narrative/thoughts). Use conversational tone for dialogue, formal for narration.
      3.  **Formatting:**
          *   Accurately translate technical terms, character names (keep original if no standard translation), and onomatopoeia (prioritize target language equivalents if they exist, otherwise keep original). Use [*TL Note: explanation*] for essential untranslatable cultural concepts or technical terms ONLY when absolutely necessary for understanding.
      4.  **Output Structure:** Respond ONLY with a valid JSON array containing the translated strings. CRITICAL: The output JSON array MUST contain exactly the same number of elements as the input JSON array (${originalTexts.length} elements). Do NOT skip, merge, or add elements.. Each element in the output array corresponds to the translated version of the element at the same index in the input array.
      5. **Repeating Strings:** CRITICAL: Don't remove the repeating strings, keep it, so the order of the strings remain intact.
      `
    }],
  };

  const userContent: Content = {
    role: "user", // Explicitly setting role is good practice
    parts: [{ text: JSON.stringify(originalTexts) }], // Send the input array as a JSON string
  };

  const schema: Schema = {
    type: Type.ARRAY, // Expect an array
    items: { type: Type.STRING } // ...of strings
  };

  const safetySettings: SafetySetting[] = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  const generationConfig: GenerateContentConfig = {
    responseMimeType: "application/json", // Request JSON output
    responseSchema: schema, // Enforce the defined schema
    temperature: 0.1, // Lower temperature for more deterministic translation
    safetySettings,
    systemInstruction
  };

  try {
    // Note: The first argument to generateContent is the prompt/contents array
    const result = await geminiModel.models.generateContent({
      model: "gemini-2.5-flash-preview-04-17",
      contents: userContent,
      config: generationConfig
    });

    // 6. Process the Structured Response
    if (!result.candidates?.length) {
      // Check if prompt was blocked
      if (result.promptFeedback?.blockReason) {
        throw new Error(`Prompt was blocked. Reason: ${result.promptFeedback.blockReason}. Details: ${result.promptFeedback.blockReasonMessage}`);
      }
      throw new Error("AI response is empty or has no candidates.");
    }

    const candidate = result.candidates[0];

    // Check for safety blocks or other finish reasons
    if (candidate.finishReason && candidate.finishReason !== 'STOP' && candidate.finishReason !== 'MAX_TOKENS') {
      console.warn(`AI generation finished due to: ${candidate.finishReason}`, candidate.safetyRatings);
      // Provide more context if available from promptFeedback
      const blockReason = result.promptFeedback?.blockReason || candidate.finishReason;
      const blockMessage = result.promptFeedback?.blockReasonMessage || 'See safety ratings.';
      throw new Error(`AI generation failed or was blocked. Reason: ${blockReason}. Details: ${blockMessage}`);
    }
    // Check safety ratings explicitly as well
    if (candidate.safetyRatings?.some(rating => rating.blocked)) {
      console.warn('AI response blocked due to safety settings:', candidate.safetyRatings);
      throw new Error('AI response blocked due to safety settings.');
    }

    if (!candidate.content?.parts?.length || typeof candidate.content.parts[0].text !== 'string') {
      console.error("Invalid response structure:", JSON.stringify(candidate.content, null, 2));
      throw new Error("AI response structure is invalid or missing the text part.");
    }

    // The SDK *should* parse the JSON when responseMimeType is application/json
    // and the schema is provided. The result *should* be in parts[0].text
    // as a string representation of the JSON. Let's parse robustly.
    let parsedJson: unknown;
    const rawText = candidate.content.parts[0].text;
    console.log("Raw AI Response Text:", rawText); // Log for debugging

    try {
      parsedJson = JSON.parse(rawText);
    } catch (parseError) {
      console.error("Failed to parse AI JSON response:", parseError);
      console.error("Raw text that failed parsing:", rawText);
      // Attempt to clean *only if* initial parsing fails
      try {
        console.warn("Attempting to clean potentially malformed JSON...");
        const parsedJson = cleanAIJsonResponse(rawText); // Use your cleaner
        console.log("Successfully parsed after cleaning.");
      } catch (cleanParseError) {
        console.error("Failed to parse even after cleaning:", cleanParseError);
        throw new Error("AI response was not valid JSON, even after cleaning attempt.");
      }
    }

    // 7. Validate the Parsed Data
    if (!Array.isArray(parsedJson)) {
      throw new Error(`AI response was valid JSON, but not an array as expected. Type: ${typeof parsedJson}`);
    }

    if (parsedJson.length !== originalTexts.length) {
      console.warn(`AI response array length (${parsedJson.length}) does not match input array length (${originalTexts.length}).`);
      // Decide how to handle this: throw error, truncate, pad? Throwing is safest.
      throw new Error(`AI response array length mismatch. Expected ${originalTexts.length}, got ${parsedJson.length}.`);
    }

    // Ensure all elements are strings (basic check)
    if (!parsedJson.every(item => typeof item === 'string')) {
      const firstNonString = parsedJson.find(item => typeof item !== 'string');
      throw new Error(`AI response array contains non-string elements. First invalid type: ${typeof firstNonString}`);
    }

    console.log(`Successfully translated ${parsedJson.length} strings.`);
    return parsedJson as string[]; // Cast to string[] after validation

  } catch (error) {
    console.error("Error during Gemini API call or processing:", error);
    // Log the specific type of error if possible
    if (error instanceof Error) {
      // Check for specific API related errors if the SDK provides them
      throw new Error(`Gemini translation failed: ${error.message}`);
    } else {
      throw new Error(`Gemini translation failed with an unknown error: ${String(error)}`);
    }
  }

  // const prompt = [
  //   {
  //     "role": "system",
  //     "content": `COMIC LOCALIZATION ENGINEER. Translate ${sourceLang}→${targetLang} text arrays sequentially following these rules:\n\n1. **Text Type Detection**:\n- Dialogue: Use conversational tone\n- Narrative: Formal register\n\n2. **Context Rules**:\n- Maintain character relationships from previous strings\n- Track plot progression between array entries\n- Preserve cliffhanger positioning\n\n3. **Format Enforcement**:\n- ALL CHARACTERS/WORDS TO UPPERCASE \n- Technical terms: [*TL Note] explanations\n- Genre adaptation (auto-detect from content)\n\n4. **Output Requirements**:\n- JSON array matching input order\n- No omitted entries\n\n5. **Validation**:\n- Verify sequential logic\n- Confirm cultural adaptation\n\nProcess strings as sequential comic panels with panel-to-panel continuity. **Gemini 2.5 Flash Settings**:\n- thinking_budget: LOW\n- escape_mode: SINGLE\n- json_format: RAW_STRING`
  //   },
  //   {
  //     "role": "user",
  //     "content": JSON.stringify(originalTexts)
  //   }
  // ]
  //
  // const response = await geminiModel.models.generateContent({
  //   model: "gemini-2.5-flash-preview-04-17",
  //   contents: JSON.stringify(prompt),
  // });
  //
  // if (!response.text) throw new Error("No response got from the ai model");
  //
  // console.log(response.text);
  //
  // return cleanAIJsonResponse(response.text);
}

// async function translateGeminiChunk(
//   texts: string[],
//   sourceLang: LocaleType,
//   targetLang: LocaleType
// ): Promise<string[]> {
//   if (!AI_API_KEY) throw new Error("No AI_API_KEY env variable found.");
//
//   const prompt = [
//     {
//       "role": "system",
//       "content": `COMIC LOCALIZATION ENGINEER. Translate ${sourceLang}→${targetLang} text arrays sequentially following these rules:\n\n1. **Text Type Detection**:\n- Dialogue: Use conversational tone\n- Narrative: Formal register\n\n2. **Context Rules**:\n- Maintain character relationships from previous strings\n- Track plot progression between array entries\n- Preserve cliffhanger positioning\n\n3. **Format Enforcement**:\n- ALL CHARACTERS/WORDS TO UPPERCASE \n- Technical terms: [*TL Note] explanations\n- Genre adaptation (auto-detect from content)\n\n4. **Output Requirements**:\n- JSON array matching input order\n- No omitted entries\n\n5. **Validation**:\n- Verify sequential logic\n- Confirm cultural adaptation\n\nProcess strings as sequential comic panels with panel-to-panel continuity. **Gemini 2.5 Flash Settings**:\n- thinking_budget: LOW\n- escape_mode: SINGLE\n- json_format: RAW_STRING`
//     },
//     {
//       "role": "user",
//       "content": JSON.stringify(texts)
//     }
//   ]
//
//   const response = await geminiModel.models.generateContent({
//     model: "gemini-2.5-flash-preview-04-17",
//     contents: JSON.stringify(prompt),
//   });
//
//   if (!response.text) throw new Error("No response got from the ai model");
//
//   console.log(response.text)
//
//   const cleanedResponse = cleanAIJsonResponse(response.text);
//
//   // Verify the response length matches the input length
//   if (Array.isArray(cleanedResponse) && cleanedResponse.length === texts.length) {
//     return cleanedResponse;
//   } else {
//     throw new Error('Translation response length mismatch');
//   }
// }


// export async function translateStringArray(
//   originalTexts: string[],
//   sourceLang: LocaleType,
//   targetLang: LocaleType,
//   parallelRequests = 5
// ): Promise<string[] | null> {
//   // Calculate chunk size based on the number of parallel requests
//   const chunkSize = Math.ceil(originalTexts.length / parallelRequests);
//
//   // Split the original array into the specified number of chunks
//   const chunks: string[][] = [];
//   for (let i = 0; i < originalTexts.length; i += chunkSize) {
//     chunks.push(originalTexts.slice(i, i + chunkSize));
//   }
//
//   try {
//     // Process all chunks in parallel
//     const translationPromises = chunks.map(chunk => translateChunk(chunk, sourceLang, targetLang));
//
//     // Wait for all translations to complete
//     const translatedChunks = await Promise.all(translationPromises);
//
//     // Flatten the results back into a single array
//     return translatedChunks.flat();
//   } catch (error) {
//     console.error('Translation failed:', error);
//     return null;
//   }
// }
//
// async function translateChunk(
//   texts: string[],
//   sourceLang: LocaleType,
//   targetLang: LocaleType
// ): Promise<string[]> {
//   if (!AI_URL) throw new Error("No AI_URL env variable found.");
//   if (!AI_API_KEY) throw new Error("No AI_API_KEY env variable found.");
//
//   const response = await fetch(AI_URL, {
//     method: 'POST',
//     headers: {
//       'Content-Type': 'application/json',
//       'Authorization': `Bearer ${AI_API_KEY}`
//     },
//     body: JSON.stringify({
//       model: "deepseek-reasoner",
//       messages: [
//         {
//           role: 'system',
//           content: `You are a professional translator. Translate the following array of texts from ${sourceLang} to ${targetLang}. Return ONLY a JSON array of translated strings in the same order as the input.`
//         },
//         {
//           role: 'user',
//           content: JSON.stringify(texts)
//         }
//       ],
//       temperature: 0.5 // Lower temperature for more consistent translations
//     })
//   });
//
//   if (!response.ok) throw new Error(`API request failed with status ${response.status}`);
//
//   const data = await response.json();
//   const cleanedResponse = cleanAIJsonResponse(data.choices[0].message.content);
//
//   // Verify the response length matches the input length
//   if (Array.isArray(cleanedResponse) && cleanedResponse.length === texts.length) {
//     return cleanedResponse;
//   } else {
//     throw new Error('Translation response length mismatch');
//   }
// }
