import { DynamicStructuredTool } from "@langchain/core/tools";


interface Transfer {
  fromPubKey: string
  toPubKey: string
  qty: string
  ticker?: string
  contract?: string
}


export const Transfer = ({
  fromPubKey,
  qty,
  toPubKey,
  contract,
  ticker
}: Transfer) => {

}
const prepareTransferTool = new DynamicStructuredTool({
  name: "prepareTransferTransaction", // Renamed from prepareSendTransaction for clarity if desired, or keep as is.
  description: "Prepares the details for sending a token to a recipient. User must confirm before sending.",
  schema: {
    type: "object",
    properties: {
      token: { type: "string", description: "The token the user wants to send." },
      amount: { type: "string", description: "The amount of token to send." },
      recipientAddress: { type: "string", description: "The address to send the token to." },
    },
    required: ["token", "amount", "recipientAddress"],
  },
  func: async ({ token, amount, recipientAddress }: { token: string, amount: string, recipientAddress: string }) => {
    console.log(`[Tool Call: prepareTransferTransaction] Token: ${token}, Amount: ${amount}, Recipient: ${recipientAddress}`);
    return `You are about to send ${amount} ${token} to ${recipientAddress}. Do you want to proceed?`;
  },
});

const executeTransferTool = new DynamicStructuredTool({
  name: "executeTransferTransaction",
  description: "Executes a token send after user confirmation.",
  schema: {
    type: "object",
    properties: {
      token: { type: "string", description: "The token being sent." },
      amount: { type: "string", description: "The amount of token sent." },
      recipientAddress: { type: "string", description: "The recipient's address." },
    },
    required: ["token", "amount", "recipientAddress"],
  },
  func: async ({ token, amount, recipientAddress }: { token: string, amount: string, recipientAddress: string }) => {
    console.log("tool called");

    console.log(`[Tool Call: executeSendTransaction] Sending ${amount} ${token} to ${recipientAddress}...`);
    await new Promise(resolve => setTimeout(resolve, 1000));
    return `Send successful! ${amount} ${token} sent to ${recipientAddress}. Transaction ID: MOCK_TX_ID_${Date.now()}`;
  },
});


const getMintAdddressByTicker = new DynamicStructuredTool({
  name: "getMintAdddressByTicker",
  description: "can be used to get the mint address of a token by its ticker",
  schema: {
    type: "object",
    properties: {
      ticker: { type: "string", description: "ticker to get the mint address" },
    },
    required: ["ticker"],
  },
  func: async ({
    ticker,
  }: {
    ticker: string;
  }) => {
    console.log("Tool called for mint address...");
    return "mint address"+ "";
  },
});


const createSwapTool = new DynamicStructuredTool({
  name: "createSwap",
  description: "Prepares a swap quote using Jupiter API based on user inputs.",
  schema: {
    type: "object",
    properties: {
      tokenIn: { type: "string", description: "The input token mint address" },
      tokenOut: { type: "string", description: "The output token mint address" },
      tokenInAmount: { type: "string", description: "The amount of input token (in smallest units, e.g., lamports)" },
      tokenOutAmount: { type: "string", description: "The desired amount of output token (optional)" },
      slippageBps: { type: "string", description: "Slippage in basis points (e.g. 100 = 1%)", default: "100" },
    },
    required: ["tokenIn", "tokenOut"],
  },
  func: async ({
    tokenIn,
    tokenOut,
    tokenInAmount,
    tokenOutAmount,
    slippageBps = "50",
  }: {
    tokenIn: string;
    tokenOut: string;
    tokenInAmount?: string;
    tokenOutAmount?: string;
    slippageBps?: string;
  }) => {
    console.log("Tool called for Jupiter quote...");


    return "Swap quote prepared. Please confirm in your wallet to proceed.";
  },
});




export const Tools: DynamicStructuredTool[] = [prepareTransferTool, executeTransferTool , createSwapTool , getMintAdddressByTicker];
