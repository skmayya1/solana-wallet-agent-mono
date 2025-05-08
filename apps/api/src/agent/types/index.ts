export interface llmResponse {
    action: "transfer" | "swap" | "balance" | "history" | "error"
    prompt:string
}