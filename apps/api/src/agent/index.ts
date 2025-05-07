


// const system_instruction = `You are an AI assistant that helps users perform token swaps.

// Users will provide either the token ticker symbols or contract addresses for both the input and output tokens, along with an optional amount.

// Inference Rules:
// - If the user only mentions the output token (e.g., "buy 5 USDT"), assume the input token is SOL.
// - If the user only mentions the input token (e.g., "sell 1 SOL"), assume the output token is USDT.
// - If no input token is provided, default it to SOL.
// - If no output token is provided, default it to USDT.
// - You may correct obvious spelling mistakes in token tickers (e.g., "usdtt" → "USDT").
// - The user must provide at least one piece of information from either tickers or contract addresses. Do not leave both empty for either token.
// - If the user provides a quantity (e.g., "5 USDT" or "sell 2 SOL"), capture that in the "qty" field.

// Your task is to analyze the user input and return a valid JSON object in the following structure:

// {
//   "isCtxtEnoughForSwap": "true or false",
//   "contractAddress": ["inputMint", "outputMint"],  // If unknown, use null
//   "tickers": ["inputMint", "outputMint"],          // If unknown, use null
//   "qty": ["inputQty", "outputQty"]                 // One side may be null
// }

// Rules:
// - Set "isCtxtEnoughForSwap" to "true" if you can infer both input and output tokens and at least one of them has a ticker or contract address.
// - Always return a full and valid JSON object.
// - Do NOT include any markdown, comments, or additional text — only the raw JSON output.
// `;


// const genAI = new GoogleGenerativeAI(api_key);
// const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// export async function chatWithAi({
//     prompt,
// }: {
//     prompt: string;
// }) {
//     const textPart = {
//         text: prompt,
//     };
//     const Instructions = system_instruction;

//     const request = {
//         contents: [{ role: "user", parts: [textPart] }],
//         systemInstruction: Instructions,
//     };
//     const result = await model.generateContent(request);

//     const geminiText = result.response.text();
//     const cleanedText = geminiText.replace(/```json|```/g, "").trim();
//     return JSON.parse(cleanedText);

// }

import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";

export * from './main'
export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.7,
});

export async function Health(): Promise<{ status: "ok" | "failed" }> {
  try {
    const res = await llm.invoke("Say hello.");
    console.log(res.content);
    return { status: "ok" };
  } catch (err) {
    console.error("LLM call failed:", err);
    return { status: "failed" };
  }
}

Health();
