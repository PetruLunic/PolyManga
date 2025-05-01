"use server";

import { auth } from "@/auth"; // Assume auth() is implemented
import dbConnect from "@/app/lib/utils/dbConnect"; // Assume dbConnect() is implemented
import {
  Content,
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
  Schema,
  Type,
  Part, // Import Part type
} from "@google/genai";
import { geminiModel } from "@/app/lib/AIModels";
import {LocaleType} from "@/app/types";

// --- Input Interface ---
interface TranslateChapterTitlesInput {
  sourceLanguage: LocaleType; // Source language code (e.g., "en")
  titles: string[]; // Array of source chapter titles
  targetLanguages: LocaleType[]; // Array of target language codes (e.g., ["ro", "ru"])
}

// --- Output Interface ---
interface TranslatedTitle {
  language: LocaleType; // Language code (e.g., "ro", "ru")
  title: string;    // The translated chapter title
}
// Output is an array (one per original chapter) of arrays (one per target language)
type TranslateChapterTitlesOutput = TranslatedTitle[][];

// --- Intermediate AI Response Interface ---
interface AIResponseStructure {
  [languageCode: string]: string[];
}


export async function translateChapterTitles(inputData: TranslateChapterTitlesInput): Promise<TranslateChapterTitlesOutput> {
  const session = await auth();

  // Authorization check (same as before)
  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden action: Only moderators and admins can translate chapter titles.");
  }
  await dbConnect(); // Connect to DB if needed for other operations or logging

  const { sourceLanguage, titles, targetLanguages } = inputData;

  // Handle empty input early
  if (!titles || titles.length === 0) {
    return []; // Return an empty array if there are no titles to translate
  }
  if (!targetLanguages || targetLanguages.length === 0) {
    console.warn("translateChapterTitles called with no target languages.");
    // Return an array of empty arrays matching the input chapter count
    return Array(titles.length).fill([]);
  }

  // --- Modified System Instruction ---
  const systemInstruction: Content = {
    // No role needed for system instructions per Gemini API docs
    parts: [{
      text: `MULTILINGUAL CHAPTER TITLE LOCALIZER.
You are tasked with translating an array of comic/manga chapter titles.

INPUT: You will receive a JSON object containing:
  - "sourceLanguage": The language code of the original text (e.g., "en").
  - "chapterTitles": An array of original chapter title strings.
  - "targetLanguages": An array of language codes (e.g., ["es", "fr", "ja"]) into which EACH chapter title should be translated.

TASK: Translate EACH string in the "chapterTitles" array from the "sourceLanguage" into *each* language specified in the "targetLanguages" array. Maintain the original order of chapters within each translated language list.

RULES:
1.  **Accuracy & Style:** Maintain a style appropriate for chapter titles (often concise, sometimes evocative). Ensure translations are accurate and natural-sounding in each target language. Preserve numerical indicators (e.g., "Chapter 1", "Vol. 2 Chapter 10").
2.  **Consistency:** Use consistent terminology across titles if applicable (e.g., recurring character names, locations).
3.  **Order:** The order of translated titles within each language array in the output *must* exactly match the order of the input "chapterTitles" array.
4.  **Output Structure:** Respond ONLY with a single, valid JSON object adhering EXACTLY to the following structure:
    {
      "targetLanguage1_code": [ "translated_title_1_lang1", "translated_title_2_lang1", ... ],
      "targetLanguage2_code": [ "translated_title_1_lang2", "translated_title_2_lang2", ... ],
      // ... one key-value pair for EACH requested target language code.
      // The value for each key is an array of strings (the translated titles).
    }
    - The keys of the JSON object *must* be the exact language codes provided in the "targetLanguages" input array.
    - Each array of translated titles *must* have the same number of elements as the input "chapterTitles" array.
    - DO NOT include any other text, explanations, or formatting outside this specific JSON structure.
5. **Copyright** These are generic chapter titles for an original comic/manga and not based on existing copyrighted material.`
    }]
  };

  const userPromptData = {
    sourceLanguage: sourceLanguage,
    chapterTitles: titles,
    targetLanguages: targetLanguages
  };

  const userContent: Content[] = [
    {
      role: "user",
      parts: [{ text: JSON.stringify(userPromptData) } as Part], // Send input as JSON string
    }
  ];

  // --- Dynamically Generated Response Schema ---
  // Create properties based on the targetLanguages array
  const properties: { [key: string]: Schema } = {};
  targetLanguages.forEach(langCode => {
    properties[langCode] = {
      type: Type.ARRAY,
      items: { type: Type.STRING },
      description: `Array of titles translated into ${langCode}, maintaining original order.` // Optional description
    };
  });

  const schema: Schema = {
    type: Type.OBJECT,
    properties: properties,
    required: targetLanguages // Ensure all requested languages are present in the response
  };

  // Safety Settings (same as before)
  const safetySettings: SafetySetting[] = [
    { category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE },
    { category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE },
  ];

  // Generation Config (updated schema)
  const generationConfig: GenerateContentConfig = {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.5, // Adjust temperature as needed for creativity vs consistency
    safetySettings,
    systemInstruction
  };

  const result = await geminiModel.models.generateContent({
    model: "gemini-2.5-flash-preview-04-17",
    contents: userContent,
    config: generationConfig,
  });

  const responseText = result?.text ?? null;

  if (!responseText) {
    console.error("AI Error: No response text received from the model.", result); // Log the full result for debugging
    throw new Error("No response text from the AI model");
  }

  let aiRawOutput: AIResponseStructure;
  try {
    aiRawOutput = JSON.parse(responseText);
  } catch (error) {
    console.error("AI Error: Failed to parse JSON response:", responseText, error);
    throw new Error("Failed to parse AI response JSON");
  }

  // --- Validate and Transform AI Output ---
  const finalOutput: TranslateChapterTitlesOutput = [];
  const expectedTitleCount = titles.length;

  // Basic validation of the received structure
  for (const lang of targetLanguages) {
    if (!aiRawOutput[lang] || !Array.isArray(aiRawOutput[lang])) {
      console.error(`AI Error: Missing or invalid array for language "${lang}" in response:`, aiRawOutput);
      throw new Error(`AI response is missing or has invalid data for language: ${lang}`);
    }
    if (aiRawOutput[lang].length !== expectedTitleCount) {
      console.error(`AI Error: Mismatched title count for language "${lang}". Expected ${expectedTitleCount}, Got ${aiRawOutput[lang].length}. Response:`, aiRawOutput);
      throw new Error(`AI response for language ${lang} has ${aiRawOutput[lang].length} titles, but expected ${expectedTitleCount}.`);
    }
  }

  // Transform into the desired nested array structure
  for (let i = 0; i < expectedTitleCount; i++) {
    const chapterTranslations: TranslatedTitle[] = [];
    for (const lang of targetLanguages) {
      chapterTranslations.push({
        language: lang,
        title: aiRawOutput[lang][i] // Get the i-th title for this language
      });
    }
    finalOutput.push(chapterTranslations);
  }

  return finalOutput;
}