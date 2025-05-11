
import React from 'react'
import Chat from '../components/Chat'
import { ChatProvider } from '../contexts/AgentContext'

const page = () => {
  return (
    <ChatProvider>
      <Chat />
    </ChatProvider>
  )
}

export default page