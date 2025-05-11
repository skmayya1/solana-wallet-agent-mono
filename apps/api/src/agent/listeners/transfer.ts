import Redis from "ioredis";
import { handleError } from "../utils/error-handler";
import { socketService } from "../../index";
import redis from "../../redis";
import { agentBuilder } from "..";

const sub = new Redis();

export function transferEventListeners() {
    sub.subscribe("transfer", (err, count) => {
        if (err) {
            console.error("❌ Failed to subscribe:", err);
            handleError();
        } else {
            console.log(`✅ Subscribed to ${count} channel(s). Listening for 'transfer' events...`);
        }
    });

    sub.on("message", async (channel, message) => {
        try {
            console.log(`📩 Message on channel [${channel}]:`, message);
            const { data, id } = JSON.parse(message);
            let conversationHistory = [];
            const storedHistory = await redis.get(id);
            if (storedHistory) {
                conversationHistory = JSON.parse(storedHistory);
            }
            const messages = {
                role: 'user',
                content: data
            }
            
            conversationHistory.push(messages)
            
            const result = await agentBuilder.invoke({ messages: conversationHistory });
            await redis.set(id, JSON.stringify(result.messages))
            socketService.getIO().to(id).emit('event:airesp', JSON.stringify(result.messages.at(-1)?.lc_kwargs.content))
        } catch (error) {
            console.error("🚨 Error processing message:", error);
            handleError();
        }
    });
}
