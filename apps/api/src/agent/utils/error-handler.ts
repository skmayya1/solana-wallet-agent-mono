import { socketService } from "../..//index"

export const handleError = ()=>{
    const message = 'Out of box MF'
    socketService.getIO().emit('chat:error',message)    
}