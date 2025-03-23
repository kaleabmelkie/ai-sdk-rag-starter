"use client";

import { ChatHeader } from "@/lib/components/ChatHeader";
import { ChatInput } from "@/lib/components/ChatInput";
import { ChatLayout } from "@/lib/components/ChatLayout";
import { MessageList } from "@/lib/components/MessageList";
import { useChat } from "@ai-sdk/react";
import { useState } from "react";

export default function Chat() {
  const [isTyping, setIsTyping] = useState(false);

  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    maxSteps: 3,
    onResponse: () => setIsTyping(true),
    onFinish: () => setIsTyping(false),
  });

  if (error) {
    console.error("Chat error:", error);
  }

  return (
    <ChatLayout
      header={<ChatHeader />}
      messageList={<MessageList messages={messages} />}
      inputArea={
        <ChatInput
          input={input}
          handleInputChange={handleInputChange}
          handleSubmit={handleSubmit}
          isLoading={isTyping}
        />
      }
    />
  );
}
