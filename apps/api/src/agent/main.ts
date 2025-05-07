import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "../agent";
import { mainAgentSystemPrompt } from "./utils/prompts";
import redis from "../redis";

interface Event {
    socketId: string | null
    prompt: string
}

export interface llmResponse {
    action: "transfer" | "swap" | "balance" | "history" | "error"
}

export async function mainAgent({
    prompt,
    socketId
}: Event) :Promise<llmResponse>{
    const llmConfig = [
        new SystemMessage(mainAgentSystemPrompt),
        new HumanMessage(prompt)
    ]
    const response = await llm.invoke(llmConfig);
    const cleanedText = response.text.replace(/```json|```/g, "").trim();

    await redis.publish("event:action",JSON.parse(cleanedText))

    return JSON.parse(cleanedText) as llmResponse
}

