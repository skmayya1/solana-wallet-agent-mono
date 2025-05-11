import { SendHorizontal } from 'lucide-react';
import React, { useState } from 'react';
import { useAgent } from '../../contexts/AgentContext';

const Input: React.FC = () => {
  const [message, setMessage] = useState<string>("");
  const { loading, sendMessage } = useAgent();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setMessage(e.target.value);
  };

  const handleSend = () => {
    if (!message.trim()) return;
    sendMessage(message);
    setMessage("");
  };

  return (
    <div className='h-16 rounded-lg w-full bg-[#1A1A1A] flex items-center justify-center border border-zinc-800'>
      <input 
        className='bg-transparent h-full w-[95%] outline-none px-5 text-base tracking-wider placeholder:opacity-40 placeholder:text-base'
        placeholder='Swap 10 sol to usd'
        onChange={handleChange}
        value={message}
        type="text" 
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSend();
        }}
      />
      <button onClick={handleSend} disabled={loading} className='cursor-pointer'>
        <SendHorizontal color='gray' />
      </button>
    </div>
  );
};

export default Input;
