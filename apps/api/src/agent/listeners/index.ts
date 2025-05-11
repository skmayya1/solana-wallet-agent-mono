import { errorEventListners } from "./error"
import { transferEventListeners } from "./transfer"

export const Listners = ()=>{
    transferEventListeners()
    errorEventListners()
}