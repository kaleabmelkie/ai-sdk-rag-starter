import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";
import "highlight.js/styles/github-dark.css";
import { Message } from "@ai-sdk/react";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const { role, content, parts } = message;
  const isUser = role === "user";

  // Function to render tool invocations
  const renderToolInvocation = (part: any) => {
    const { toolInvocation } = part;
    const { toolName, state } = toolInvocation;

    return (
      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 p-2 rounded border border-gray-200 dark:border-gray-700">
        <div className="text-gray-500 dark:text-gray-400 mb-1">
          <span className="font-semibold">Tool:</span> {toolName}
        </div>
        <div className="text-gray-500 dark:text-gray-400">
          <span className="font-semibold">Status:</span>{" "}
          {state === "result" ? (
            <span className="text-green-600 dark:text-green-400">
              Completed
            </span>
          ) : (
            <span className="text-amber-600 dark:text-amber-400">
              Running...
            </span>
          )}
        </div>
        {state === "result" && "result" in toolInvocation && (
          <div className="mt-1 overflow-auto max-h-40">
            <span className="font-semibold text-gray-500 dark:text-gray-400">
              Result:
            </span>
            <div className="whitespace-pre-wrap text-gray-700 dark:text-gray-300 text-xs mt-1 pl-2 border-l-2 border-gray-300 dark:border-gray-600">
              {typeof toolInvocation.result === "string"
                ? toolInvocation.result
                : JSON.stringify(toolInvocation.result, null, 2)}
            </div>
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-blue-600 text-white rounded-tr-none"
            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-tl-none"
        }`}
      >
        {content && content.length > 0 ? (
          <div
            className={`prose ${
              !isUser ? "prose-dark" : "prose-invert"
            } max-w-none`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-900 text-gray-100 rounded-md p-4 overflow-auto"
                    {...props}
                  />
                ),
                code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code
                        className={`${className} bg-gray-800 text-gray-200 px-1 py-0.5 rounded`}
                        {...props}
                      >
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className={className} {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {content}
            </ReactMarkdown>
          </div>
        ) : (
          <div>
            {parts && parts.length > 0 && (
              <div className="italic text-gray-600 dark:text-gray-400 text-sm">
                {parts.map((part, index) => (
                  <React.Fragment key={index}>
                    {part.type === "tool-invocation" &&
                      renderToolInvocation(part)}
                  </React.Fragment>
                ))}
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
