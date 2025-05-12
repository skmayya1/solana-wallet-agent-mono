import 'dotenv/config';
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { formatToOpenAITool } from 'langchain/tools';

import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { AIMessage } from "@langchain/core/messages";
import { Tools} from './tools';

export const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: process.env.GOOGLE_API_KEY!,
  temperature: 0.7,
});

const Agent = llm.bind({
  tools:Tools.map(formatToOpenAITool)
 })

async function llmcall (state : typeof MessagesAnnotation.State) {
  const result = await Agent.invoke([
    {
      role:"system",
      content:"You are a helpful assistant tasked with performing trasfer , swap  on solana chain behalf of the user based on inputs"
    },
    ...state.messages
  ])
  return {
    messages : [result]
  }
}

const toolNode = new ToolNode(Tools);

function shouldContinue(state: typeof MessagesAnnotation.State) {
  const messages = state.messages;
  const lastMessage = messages.at(-1);

  if (lastMessage instanceof AIMessage && lastMessage.tool_calls?.length) {
    return "Action";
  }
  return "__end__";
}

export const agentBuilder = new StateGraph(MessagesAnnotation)
  .addNode("llmCall", llmcall)
  .addNode("tools", toolNode)
  // Add edges to connect nodes
  .addEdge("__start__", "llmCall")
  .addConditionalEdges(
    "llmCall",
    shouldContinue,
    {
      "Action": "tools",
      "__end__": "__end__",
    }
  )
  .addEdge("tools", "llmCall")
  .compile();

 
export async function Health(): Promise<{ status: "ok" | "failed" }> {
  try {
    
    return { status: "ok" };
  } catch (err) {
    console.error("LLM call failed:", err);
    return { status: "failed" };
  }
}
