import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { transferTools } from './transfer/tools';
import { formatToOpenAITool } from 'langchain/tools';
import { agentBuilder } from './transfer';


export * from './main'

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.7,
});

export const TransferAgent = llm.bind({
  tools:transferTools.map(formatToOpenAITool)
 })


export async function Health(): Promise<{ status: "ok" | "failed" }> {
  try {
    const messages = [{
      role: "user",
      content: "buy 10 bonk and send to skmayya.sol"
    }];
    const result = await agentBuilder.invoke({ messages });
    console.log(result.messages);
    
    return { status: "ok" };
  } catch (err) {
    console.error("LLM call failed:", err);
    return { status: "failed" };
  }
}

Health();
