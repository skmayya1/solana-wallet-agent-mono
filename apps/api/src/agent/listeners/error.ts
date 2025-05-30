import Redis from "ioredis";
// import { llmResponse } from "../types";
import { handleError } from "../utils/error-handler";

const redis = new Redis()

export function errorEventListners() {
    redis.subscribe('error', (err, count) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        } else {
            console.log(`Successfully subscribed! ${count} channels`);
        }
    });
    redis.on('message', async (channel, message) => {
        console.log(`Now listening to ${channel}`);
        // const { action, prompt }: llmResponse = JSON.parse(message)
        handleError()
    });

}