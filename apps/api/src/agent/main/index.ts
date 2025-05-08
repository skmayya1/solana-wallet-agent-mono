import { SystemMessage, HumanMessage } from "@langchain/core/messages";
import { llm } from "../../agent";
import { mainAgentSystemPrompt } from "../utils/prompts";
import redis from "../../redis";
import { llmResponse } from "../types";

interface Event {
    socketId: string | null
    prompt: string
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

    const data = {
        action:JSON.stringify(cleanedText),
        prompt
    }
    const channel = data.action || "error"
    
    await redis.publish(channel,JSON.stringify(data))
    return JSON.parse(cleanedText) 
}

