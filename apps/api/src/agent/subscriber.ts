import Redis from "ioredis";
import { llmResponse } from ".";

const redis = new Redis()


export function actionEventListners () {
    redis.subscribe('event:action', (err, count) => {
        if (err) {
            console.error('Failed to subscribe:', err);
        } else {
            console.log(`Successfully subscribed! ${count} channels`);
        }
    });
    redis.on('message', async (channel, message) => {
        console.log(`Now listening to ${channel}`);
        console.log(JSON.stringify(message));
    });
}