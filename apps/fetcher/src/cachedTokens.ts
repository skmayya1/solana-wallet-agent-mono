import redis from "./redis";
import dotenv from "dotenv"

dotenv.config()

const REDIS_CACHE_KEY = process.env.REDIS_CACHEKEY || 'jupiter_tokens_cache';

  export type Token = {
      symbol: string;
      name: string;
      address: string;
      logoURI: string;
      decimals:number;
    };

export const getCachedTokens = async (): Promise<Token[]> =>{
    const cachedData = await redis.get(REDIS_CACHE_KEY);
    if (!cachedData) return []
    return JSON.parse(cachedData)
}
