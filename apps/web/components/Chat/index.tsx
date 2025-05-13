'use client'

import Navbar from '../Navbar'
import ChatContainer from './ChatContainer'
import Input from './Input'


const Chat = () => {
  let messages = true

  return (
    <div className="h-screen w-full flex flex-col items-center overflow-hidden">
              <Navbar/>
      
      <div className={`p-10 flex flex-col items-center transition-all ease-in-out duration-300 h-full w-[60%] ${messages ? 'justify-between':'justify-center'}`}>
        {messages && <ChatContainer />}
        <Input />
      </div>
    </div>
  )
}

export default Chat