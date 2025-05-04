import express from 'express';
import cron from 'node-cron';
import dotenv from "dotenv"
import redis from './redis';
import { getTokenDetails } from './getTokenDetails';

export interface TokenRequest {
  tickers: string[];
  addresses: string[];
}

dotenv.config()

const app = express();
const PORT = Number(process.env.PORT)  || 4000;
const ISPRODUCTION = process.env.ENVIRONMENT == 'PRODUCTION' || false
const REDIS_CACHE_KEY = process.env.REDIS_CACHEKEY || 'jupiter_tokens_cache';


const delay = (ms: number) => new Promise(resolve => setTimeout(resolve, ms));


const fetchTokensWithRetry = async (maxRetries: number = 3): Promise<Token[]> => {
  let attempt = 0;
  while (attempt < maxRetries) {
    try {
      const res = await fetch('https://lite-api.jup.ag/tokens/v1/all');
      const tokens = await res.json();
      
      if (tokens.length === 0) {
        console.log('Received empty tokens, retrying...');
        attempt++;
        await delay(5000); 
      } else {
        return tokens;
      }
    } catch (error) {
      console.error('Error fetching tokens:', error);
      attempt++;
      await delay(5000);
    }
  }



  throw new Error('Failed to fetch tokens after retries');
};


const updateTokenCache = async () => {
  console.log("Fetching Tokens data...");
  try {
    const tokens = await fetchTokensWithRetry(); 
    if (tokens.length === 0) {
      console.log("No tokens found, skipping cache update.");
      return;
    }
    await redis.del(REDIS_CACHE_KEY);
    await redis.set(REDIS_CACHE_KEY, JSON.stringify(tokens));
    console.log("Tokens data updated in cache successfully.");
  } catch (error) {
    console.error("Failed to fetch tokens:", error);
  }
};

cron.schedule('0 */5 * * *', async () => {
  console.log('Running scheduled task every 5 hours...');
  console.log("Fetching Tokens data...");
  await updateTokenCache()
});

if(ISPRODUCTION){
  setTimeout(updateTokenCache, 100000);
}


app.get('/health', (_req, res) => {
  res.json({ message: 'OK' ,
    redis_connected:redis.status
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
  message:string;
  tokenInfo: {
      inputMint:string,
      outputMint:string,
      InputTokenDecimal:number ;
      outputTokenDecimal:number;
      Input?:string;
      output?:string;
  }
  error:string | null
} 



// import fetch from 'node-fetch';
// import {redis} from './redis'

// const REDIS_CACHE_KEY = 'jupiter_tokens_cache';
// const HOUR = 600 * 60; 

type Token = {
  symbol: string;
  name: string;
  address: string;
  logoURI: string;
  decimals:number;
};

// export async function getCachedJupiterTokens(): Promise<Token[]> {
//   const cachedData = await redis.get(REDIS_CACHE_KEY);
//   if (cachedData) {
//     return JSON.parse(cachedData);
//   }
  // console.log("Fetching Tokens data..");
  
  // const res = await fetch('https://lite-api.jup.ag/tokens/v1/all');
  // const tokens = (await res.json()) as Token[];

  // await redis.set(REDIS_CACHE_KEY, JSON.stringify(tokens));

//   return tokens;
// }



// export const GetTokenInfo = async (GeminiResponse: GeminiResponse):Promise<TokenResponse> => {
//   const tokens = await getCachedJupiterTokens()

//   console.log(GeminiResponse.tickers[0]);
//   const mintAddresses: string[] = [];
//   const mintDecimals:number[] =[];
//   const mintName: string[] = [];

//   if (GeminiResponse.tickers.length === 2 && 
//       GeminiResponse.tickers[0] !== '' && GeminiResponse.tickers[1] !== '') {
  
//       for (let i = 0; i < GeminiResponse.tickers.length; i++) {
//           const ticker = GeminiResponse.tickers[i];
  
//           const token = tokens.find((t: any) => t.symbol.toUpperCase() === ticker.toUpperCase());
          
//           if (!token) {
//               throw new Error(`Token ${ticker} not found on Jupiter`);
//           }
//           const mint = token.address;
//           mintAddresses.push(mint); 
//           const decimal = token.decimals
//           mintDecimals.push(decimal)
//           const symbol = token.symbol
//           mintName.push(symbol)
//           console.log(`Mint address for ${ticker}:`, mint);
//       }
//       console.log('Both mint addresses:', mintAddresses);
//   }
//   return {
//       message: "Correct Contract Addresses",
//       tokenInfo: {
//           inputMint:mintAddresses[0],
//           outputMint:mintAddresses[1],
//           InputTokenDecimal:mintDecimals[0],
//           outputTokenDecimal:mintDecimals[1],
//           Input:mintName[0],
//           output:mintName[1]
//       },
//       error: null
//   }}

  