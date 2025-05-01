## 🔍 GET /token

Fetch Solana token metadata by providing **tickers** (symbols) or **contract addresses**. Supports batch lookup.

### 📤 Request 


| Query Param | Type       | Description                                 |
|-------------|------------|---------------------------------------------|
| `tickers`   | `string[]` | Token symbols (e.g., `USDC`, `SOL`, etc.)   |
| `addresses` | `string[]` | Token mint addresses on the Solana network  |



```

GET /token?tickers=USDC&tickers=SOL&addresses=So1111111111111111&addresses=7dg32...xyz

```
## Examle Response
```
[
  {
    "symbol": "USDC",
    "name": "USD Coin",
    "address": "A1b2C3d4E5f6G7h8I9j0K1l2M3n4O5p6Q7r8S9t0",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/USDC/logo.png",
    "decimals": 6
  },
  {
    "symbol": "SOL",
    "name": "Solana",
    "address": "So11111111111111111111111111111111111111112",
    "logoURI": "https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/SOL/logo.png",
    "decimals": 9
  }
]
```
