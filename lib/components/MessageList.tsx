import React, { useEffect, useRef } from "react";
import { MessageBubble } from "./MessageBubble";
import { Message } from "@ai-sdk/react";

type MessageListProps = {
  messages: Message[];
};

export function MessageList({ messages }: MessageListProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-full py-12">
        <div className="text-center space-y-3">
          <div className="text-4xl">👋</div>
          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200">
            Welcome to the Chat
          </h2>
          <p className="text-gray-600 dark:text-gray-400 max-w-md">
            Ask me anything and I&apos;ll do my best to help you.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col space-y-2">
      {messages.map((message) => (
        <MessageBubble key={message.id} message={message} />
      ))}
      <div ref={bottomRef} />
    </div>
  );
}
