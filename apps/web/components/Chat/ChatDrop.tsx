import React from 'react'
import { Message } from '../../contexts/AgentContext'

const ChatDrop: React.FC<Message> = ({
    content,
    type
}) => {
    const isHuman = type === 'human';
    return (
        <div
            className={`h-fit max-w-[70%] w-fit mb-4 p-4 rounded-lg border border-zinc-800 ${
                isHuman ? ' self-end' : ' self-start'
            }`}
            style={{
                backgroundColor: '#1A1A1A',
            }}
        >
            {content}
        </div>
    )
}

export default ChatDrop