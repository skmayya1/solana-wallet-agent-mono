import express from 'express';
import cron from 'node-cron';
import dotenv from "dotenv";
import redis from './redis';
import { getTokenDetails } from './getTokenDetails';
import status from 'express-status-monitor';
import axios from 'axios';
import { parser } from 'stream-json';
import { streamArray } from 'stream-json/streamers/StreamArray';
import { chain } from 'stream-chain';

export interface TokenRequest {
  tickers: string[];
  addresses: string[];
}

dotenv.config();

const app = express();
app.use(status());

const PORT = Number(process.env.PORT) || 8000;
const ISPRODUCTION = process.env.ENVIRONMENT == 'PRODUCTION' || false;
const REDIS_CACHE_KEY = process.env.REDIS_CACHEKEY || 'jupiter_tokens_cache';
const REDIS_INDEX_KEY = `${REDIS_CACHE_KEY}:index`;

const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));
const streamTokensToRedis = async (maxRetries: number = 3): Promise<number> => {
  let attempt = 0;
  let tokenCount = 0;
  const tokenIndex = new Map();

  while (attempt < maxRetries) {
    try {
      console.log(`Attempt ${attempt + 1} to fetch and stream tokens...`);
      tokenCount = 0;

      await redis.del(REDIS_INDEX_KEY);
      const keys = await redis.keys(`${REDIS_CACHE_KEY}:token:*`);
      if (keys.length > 0) {
        await redis.del(keys);
      }

      const response = await axios.get('https://lite-api.jup.ag/tokens/v1/all', {
        headers: {
          'Accept-Encoding': 'gzip, deflate, br'
        },
        responseType: 'stream'
      });

      await new Promise<void>((resolve, reject) => {
        const pipeline = chain([
          response.data,
          parser(),
          streamArray()
        ]);

        pipeline.on('data', async ({ value }) => {
          try {
            const token = value as Token;
            tokenCount++;
            if (token.address && token.symbol) {
              tokenIndex.set(token.symbol.toUpperCase(), token.address);

              const essentialTokenData = {
                symbol: token.symbol,
                name: token.name,
                address: token.address,
                logoURI: token.logoURI,
                decimals: token.decimals
              };

              await redis.set(`${REDIS_CACHE_KEY}:token:${token.address}`, JSON.stringify(essentialTokenData));
            }
          } catch (err) {
            console.error('Error processing token:', err);
          }
        });

        pipeline.on('error', (err) => {
          console.error('Pipeline error:', err);
          reject(err);
        });

        pipeline.on('end', async () => {
          try {
            // Store the index for symbol -> address lookups
            const indexObj = Object.fromEntries(tokenIndex);
            await redis.set(REDIS_INDEX_KEY, JSON.stringify(indexObj));

            console.log(`Stream complete. Processed ${tokenCount} tokens.`);
            resolve();
          } catch (err) {
            console.error('Error finalizing token processing:', err);
            reject(err);
          }
        });
      });

      if (tokenCount === 0) {
        console.log('Received empty tokens, retrying...');
        attempt++;
        await delay(5000);
      } else {
        console.log(`Successfully processed ${tokenCount} tokens`);
        return tokenCount;
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      attempt++;
      await delay(5000);
    }
  }
  throw new Error('Failed to fetch tokens after retries');
};

/**
 * Updates the token cache through direct streaming to Redis
 */
const updateTokenCache = async () => {
  console.log("Starting token cache update...");
  try {
    const tokenCount = await streamTokensToRedis();
    console.log(`Token cache updated successfully. Processed ${tokenCount} tokens.`);

    // Store metadata
    await redis.set(`${REDIS_CACHE_KEY}:meta`, JSON.stringify({
      totalTokens: tokenCount,
      updatedAt: new Date().toISOString()
    }));
  } catch (error) {
    console.error("Failed to update token cache:", error);
  }
};

// Initial cache update
// updateTokenCache();

// Schedule regular updates
cron.schedule('0 */5 * * *', async () => {
  console.log('Running scheduled task every 5 hours...');
  await updateTokenCache();
});

/**
 * Get token details by address or symbol
 * @param address Token address
 * @param symbol Token symbol (alternative to address)
 */
export async function getTokenByAddressOrSymbol(address?: string, symbol?: string): Promise<Token | null> {
  try {
    if (address) {
      // Direct lookup by address
      const tokenData = await redis.get(`${REDIS_CACHE_KEY}:token:${address}`);
      return tokenData ? JSON.parse(tokenData) : null;
    } else if (symbol) {
      const indexData = await redis.get(REDIS_INDEX_KEY);
      if (indexData) {
        const index = JSON.parse(indexData);
        const tokenAddress = index[symbol.toUpperCase()];

        if (tokenAddress) {
          const tokenData = await redis.get(`${REDIS_CACHE_KEY}:token:${tokenAddress}`);
          return tokenData ? JSON.parse(tokenData) : null;
        }
      }
    }
    return null;
  } catch (error) {
    console.error("Error getting token:", error);
    return null;
  }
}

app.get('/health', (_req, res) => {
  res.json({
    message: 'OK',
    redis_connected: redis.status
  });
});

app.get('/token', async (req, res) => {
  const queries: TokenRequest = {
    tickers: Array.isArray(req.query.tickers)
      ? req.query.tickers.map(String)
      : req.query.tickers ? [String(req.query.tickers)] : [],

    addresses: Array.isArray(req.query.addresses)
      ? req.query.addresses.map(String)
      : req.query.addresses ? [String(req.query.addresses)] : [],
  };

  const isNotValid = queries.addresses.length === 0 && queries.tickers.length === 0;

  if (isNotValid) {
     res.status(400).json({ message: "Both cannot be empty!" });
  }

  const TokenDetails = await getTokenDetails(queries);

  if (TokenDetails.length === 0) {
     res.status(500).json({ message: "Something went wrong!" });
  }

  res.json(TokenDetails);
});

app.listen(PORT, '0.0.0.0', () => {
  console.log(`API running on port ${PORT}`);
});

interface TokenResponse {
  message: string;
  tokenInfo: {
    inputMint: string,
    outputMint: string,
    InputTokenDecimal: number;
    outputTokenDecimal: number;
    Input?: string;
    output?: string;
  }
  error: string | null
}

type Token = {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals: number;
};