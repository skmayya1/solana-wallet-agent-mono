import React from 'react'
import ChatDrop from './ChatDrop'
import { useAgent } from '../../contexts/AgentContext'

const ChatContainer = () => {
    const { messages } = useAgent()
    return (
        <div className='max-h-[90%] w-full flex  flex-col items-center overflow-y-auto p-4 rounded-lg '>
            {
                messages.map((item, index) => (
                    <ChatDrop 
                        content={item.content}
                        type={item.type}
                        key={index}
                    />
                ))
            }
        </div>
    )
}

export default ChatContainer