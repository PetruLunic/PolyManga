"use server"

import {auth} from "@/auth";
import dbConnect from "@/app/lib/utils/dbConnect";
import {
  Content,
  GenerateContentConfig,
  HarmBlockThreshold,
  HarmCategory,
  SafetySetting,
  Schema,
  Type
} from "@google/genai";
import {geminiModel} from "@/app/lib/AIModels";
import {GEMINI_MODEL} from "@/app/lib/utils/constants";

interface TranslateMangaInput {
  language: string; // Source language code (e.g., "en")
  title: string;    // Source title
  description: string; // Source description
  targetLanguages: string[]; // Array of target language codes (e.g., ["es", "ru"])
}

interface TranslatedText {
  language: string; // Language code (e.g., "en", "es")
  value: string;    // The text (title or description)
}

interface TranslateMangaOutput {
  titles: TranslatedText[];
  descriptions: TranslatedText[];
}

export async function translateManga(inputData: TranslateMangaInput): Promise<TranslateMangaOutput> {
  const session = await auth(); // Replace with actual auth() implementation

  // This action can use only moderators and admins
  if (!session || (session.user.role !== "MODERATOR" && session.user.role !== "ADMIN")) {
    throw new Error("Forbidden action");
  }
  await dbConnect(); // Replace with actual dbConnect() implementation

  const {language: sourceLanguage, title: sourceTitle, description: sourceDescription, targetLanguages} = inputData;

  // *** MODIFIED System Instruction ***
  const systemInstruction: Content = {
    // No role needed for system instructions per Gemini API docs
    parts: [{
      text: `MULTILINGUAL CONTENT LOCALIZER.
You are tasked with translating comic/manga metadata (title and description).
INPUT: You will receive a JSON object containing:
  - "sourceLanguage": The language code of the original text (e.g., "en").
  - "title": The original title string.
  - "description": The original description string.
  - "targetLanguages": An array of language codes (e.g., ["es", "fr", "ja"]) into which the title and description should be translated.

TASK: Translate the provided "title" and "description" from the "sourceLanguage" into *each* language specified in the "targetLanguages" array.

RULES:
1.  **Accuracy & Tone:** Maintain the original tone and style appropriate for a comic/manga title and description (often engaging, sometimes dramatic or intriguing). Ensure translations are accurate and natural-sounding in each target language.
2.  **Names:** Keep character names and place names consistent. Use standard accepted translations if they exist for the target language, otherwise keep the original name.
3.  **Cultural Nuance:** Handle cultural references appropriately for each target audience. Use [*TL Note: explanation*] sparingly ONLY if a concept is untranslatable and essential for understanding the *description* (rarely needed for titles).
4.  **Output Structure:** Respond ONLY with a single, valid JSON object adhering EXACTLY to the following structure:
    {
      "titles": [
        { "language": "sourceLanguage_code", "value": "original_title" },
        { "language": "targetLanguage1_code", "value": "translated_title_1" },
        { "language": "targetLanguage2_code", "value": "translated_title_2" },
        // ... one object for the original + each target language
      ],
      "descriptions": [
        { "language": "sourceLanguage_code", "value": "original_description" },
        { "language": "targetLanguage1_code", "value": "translated_description_1" },
        { "language": "targetLanguage2_code", "value": "translated_description_2" },
        // ... one object for the original + each target language
      ]
    }
    - The order of translated items within the arrays does not strictly matter, but *must* include the original source text pair tagged with the source language code first, followed by pairs for *all* requested target languages.
    - Ensure the language codes in the output match the source and requested target language codes precisely.
    - DO NOT include any other text, explanations, or formatting outside the JSON structure.`
    }],
  };

  const userPromptData = {
    sourceLanguage: sourceLanguage,
    title: sourceTitle,
    description: sourceDescription,
    targetLanguages: targetLanguages
  };

  const userContent: Content[] = [ // Pass content as an array of Content objects
    {
      role: "user",
      parts: [{text: JSON.stringify(userPromptData)}], // Send the input data as a JSON string
    }
  ];


  // *** MODIFIED Response Schema ***
  const schema: Schema = {
    type: Type.OBJECT,
    properties: {
      'titles': {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            'language': {type: Type.STRING},
            'value': {type: Type.STRING}
          },
          required: ['language', 'value']
        },
      },
      'descriptions': {
        type: Type.ARRAY,
        items: {
          type: Type.OBJECT,
          properties: {
            'language': {type: Type.STRING},
            'value': {type: Type.STRING}
          },
          required: ['language', 'value']
        }
      }
    },
    required: ['titles', 'descriptions']
  };

  const safetySettings: SafetySetting[] = [
    {category: HarmCategory.HARM_CATEGORY_HARASSMENT, threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_HATE_SPEECH, threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_SEXUALLY_EXPLICIT, threshold: HarmBlockThreshold.BLOCK_NONE},
    {category: HarmCategory.HARM_CATEGORY_DANGEROUS_CONTENT, threshold: HarmBlockThreshold.BLOCK_NONE},
  ];

  const generationConfig: GenerateContentConfig = {
    responseMimeType: "application/json",
    responseSchema: schema,
    temperature: 0.3,
    safetySettings,
    systemInstruction
  };

  const result = await geminiModel.models.generateContent({
    model: GEMINI_MODEL,
    contents: userContent,
    config: generationConfig,
  });

  const responseText = result?.text ?? null;

  if (!responseText) {
    console.error("AI Error: No response text received from the model.", result); // Log the full result for debugging
    throw new Error("No response text from the AI model");
  }

  try {
    const parsedResult: TranslateMangaOutput = JSON.parse(responseText);

    // Optional: Add validation logic here to ensure the parsedResult structure matches TranslateMangaOutput
    if (!parsedResult || !Array.isArray(parsedResult.titles) || !Array.isArray(parsedResult.descriptions)) {
      throw new Error("AI response did not match the expected JSON structure.");
    }

    return parsedResult;
  } catch (error) {
    console.error("AI Error: Failed to parse JSON response:", responseText, error);
    throw new Error("Failed to parse AI response JSON");
  }
}