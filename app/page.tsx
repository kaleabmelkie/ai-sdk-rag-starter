"use client";

import { useChat } from "@ai-sdk/react";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit, error } = useChat({
    maxSteps: 3,
  });

  if (error) {
    alert(error.message);
  }

  return (
    <div className="flex flex-col w-full max-w-screen-md py-24 mx-auto stretch">
      <div className="space-y-4">
        {messages.map((m) => (
          <div key={m.id} className="whitespace-pre-wrap">
            <div>
              <div className="font-bold">{m.role}</div>
              <p>
                {m.content.length > 0 ? (
                  m.content
                ) : (
                  <span className="italic font-light">
                    {m.parts.map((p, i) => (
                      <div key={i}>
                        {p.type === "tool-invocation"
                          ? `calling "${p.toolInvocation.toolName}": ${
                              p.toolInvocation.state === "result"
                                ? typeof p.toolInvocation.result === "string"
                                  ? p.toolInvocation.result
                                  : "Thinking..."
                                : "Running..."
                            }`
                          : null}
                      </div>
                    ))}
                  </span>
                )}
              </p>
            </div>
          </div>
        ))}
      </div>

      <form
        className="fixed bottom-4 left-0 right-0 mx-auto w-full max-w-screen-md"
        onSubmit={handleSubmit}
      >
        <div className="relative">
          <textarea
            className="w-full border p-4 pr-16 rounded-xl bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500 dark:focus:ring-blue-400 text-base resize-none overflow-hidden"
            value={input}
            placeholder="Ask me anything..."
            rows={1}
            required
            onChange={(e) => {
              handleInputChange(e);
              e.target.style.height = "auto";
              e.target.style.height = `${e.target.scrollHeight}px`;
            }}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                handleSubmit(e as any);
              }
            }}
            ref={(textareaRef) => {
              if (textareaRef) {
                textareaRef.style.height = "auto";
                textareaRef.style.height = `${textareaRef.scrollHeight}px`;
              }
            }}
          />
          <button
            className="absolute right-4 top-1/2 transform -translate-y-1/2 p-2.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center"
            type="submit"
            aria-label="Send message"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            >
              <line x1="22" y1="2" x2="11" y2="13"></line>
              <polygon points="22 2 15 22 11 13 2 9 22 2"></polygon>
            </svg>
          </button>
        </div>
      </form>
    </div>
  );
}
