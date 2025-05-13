
import React from 'react'
import Chat from '../components/Chat'
import { ChatProvider } from '../contexts/AgentContext'
import { SolanaProvider } from '../contexts/WalletContext'
import Navbar from '../components/Navbar'

const page = () => {
  return (
    <SolanaProvider>
      <ChatProvider>
          <Chat />
      </ChatProvider>
    </SolanaProvider>
  )
}

export default page