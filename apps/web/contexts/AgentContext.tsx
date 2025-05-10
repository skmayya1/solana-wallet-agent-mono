'use client'

import React, { createContext, useContext, useEffect, useRef, useState } from "react";
import { io, Socket } from "socket.io-client";

type Message = {
  id: string;
  sender: string;
  content: string;
  timestamp: number;
};

type ChatContextType = {
  messages: Message[];
  sendMessage: (msg: string) => void;
  connected: boolean;
};

const ChatContext = createContext<ChatContextType | null>(null);



export const ChatProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const [connected, setConnected] = useState(false);
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

    return () => {
        socket.disconnect();
      };
  }, []);

  const sendMessage = (msg: string) => {
    if (socketRef.current && connected) {
      const message: Omit<Message, "id" | "timestamp"> = {
        sender: "user", // You can make this dynamic
        content: msg,
      };
      socketRef.current.send(JSON.stringify(message));
    }
  };

  return (
    <ChatContext.Provider value={{ messages, sendMessage, connected }}>
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