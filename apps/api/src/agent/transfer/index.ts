import { MessagesAnnotation, StateGraph } from "@langchain/langgraph";
import { TransferAgent } from "..";
import { ToolNode } from "@langchain/langgraph/prebuilt";
import { transferTools } from "./tools";
import { AIMessage } from "@langchain/core/messages";

async function llmcall (state : typeof MessagesAnnotation.State) {
  const result = await TransferAgent.invoke([
    {
      role:"system",
      content:"You are a helpful assistant tasked with performing trasfer on solana chain behalf of the user based on inputs"
    },
    ...state.messages
  ])
  return {
    messages : [result]
  }
}

const toolNode = new ToolNode(transferTools);


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