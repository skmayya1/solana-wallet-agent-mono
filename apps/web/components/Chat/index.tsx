'use client'

import React from 'react'
import { ChatProvider } from '../../contexts/AgentContext'

const Chat = () => {
  return (
     <ChatProvider >
        <div className="h-screen w-full">

        </div>
     </ChatProvider>
  )
}

export default Chat