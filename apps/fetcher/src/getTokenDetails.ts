import { TokenRequest } from "src";
import { Token } from "./cachedTokens";
import { getCachedTokens } from './cachedTokens';


export const getTokenDetails = async (queries: TokenRequest): Promise<Token[]> => {
    const tokens = await getCachedTokens();
    
    if (!tokens) {
      return [];
    }
    
    const results: Token[] = [];
        if (queries.tickers.length > 0) {
      const tickerMatches = tokens.filter(token => 
        queries.tickers.some(ticker => 
          token.symbol.toLowerCase() === ticker.toLowerCase()
        )
      );
      results.push(...tickerMatches);
    }
        if (queries.addresses.length > 0) {
      const addressMatches = tokens.filter(token => 
        queries.addresses.some(address => 
          token.address.toLowerCase() === address.toLowerCase()
        )
      );
      results.push(...addressMatches);
    }
    
    const uniqueResults = results.filter((token, index, self) =>
      index === self.findIndex(t => t.address === token.address)
    );
    
    return uniqueResults as Token[];
  }