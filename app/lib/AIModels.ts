import {GoogleGenAI} from "@google/genai";

const AI_API_KEY = process.env.GEMINI_API_KEY;

export const geminiModel = new GoogleGenAI({ apiKey: AI_API_KEY});