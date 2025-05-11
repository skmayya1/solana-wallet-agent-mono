'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

export type Message = {
  type: 'human' | 'agent'
  content: string;
};

type ChatContextType = {
  messages: Message[];
  loading: boolean
  sendMessage: (msg: string) => void;
  connected: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);

export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
  const [loading, setloading] = useState(false)
  const socketRef = useRef<Socket | null>(null);

  useEffect(() => {
    const socket = io("http://localhost:5000");

    socketRef.current = socket;
    socket.on("connect", () => {
      setConnected(true);
      console.log("Socket.io connected");
    });
    socket.on("disconnect", () => {
      setConnected(false);
      console.log("Socket.io disconnected");
    });
    socket.on("event:airesp", (data) => {
      const msgRecieved = JSON.parse(data)
      setMessages((prev) => [...prev, {
        content: msgRecieved,
        type: "agent"
      }])
    })
    return () => {
      socket.disconnect();
    };
  }, []);

  const sendMessage = (msg: string) => {
    if (socketRef.current && connected) {
      setMessages((prev) => [...prev, {
        content: msg,
        type: "human"
      }])
      socketRef.current.emit('event:msg', msg)
    }
  };

  return (
    <ChatContext.Provider value={{ messages, loading, sendMessage, connected }}>
      {children}
    </ChatContext.Provider>
  );
};


export const useAgent = () => {
  const context = useContext(ChatContext);
  if (!context) {
    throw new Error("useChat must be used within a ChatProvider");
  }
  return context;
};