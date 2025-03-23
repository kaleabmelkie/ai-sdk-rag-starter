import "highlight.js/styles/github-dark.css";

import { Message } from "@ai-sdk/react";
import React from "react";
import ReactMarkdown from "react-markdown";
import rehypeHighlight from "rehype-highlight";
import remarkGfm from "remark-gfm";

type MessageBubbleProps = {
  message: Message;
};

export function MessageBubble({ message }: MessageBubbleProps) {
  const { role, content, parts } = message;
  const isUser = role === "user";

  // Function to render tool invocations
  const renderToolInvocation = (
    part: Exclude<typeof parts, undefined>[number]
  ) => {
    if (!part || !("toolInvocation" in part)) return null;

    const { toolInvocation } = part;
    const { toolName, state } = toolInvocation;

    return (
      <div className="mt-2 text-xs bg-gray-100 dark:bg-gray-800 rounded-lg overflow-hidden border border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between gap-8 px-3 py-2 bg-gray-200 dark:bg-gray-700">
          <div className="font-medium">{toolName}</div>
          {state === "result" ? (
            <span className="text-xs px-2 py-1 bg-green-100 dark:bg-green-900 text-green-800 dark:text-green-200 rounded-full">
              Completed
            </span>
          ) : (
            <span className="text-xs px-2 py-1 bg-amber-100 dark:bg-amber-900 text-amber-800 dark:text-amber-200 rounded-full">
              Running...
            </span>
          )}
        </div>

        {state === "result" && "result" in toolInvocation && (
          <div className="p-3 overflow-auto max-h-60">
            {typeof toolInvocation.result === "string" ? (
              <div className="whitespace-pre-wrap">{toolInvocation.result}</div>
            ) : typeof toolInvocation.result === "object" &&
              toolInvocation.result ? (
              <div className="space-y-2">
                {Object.entries(toolInvocation.result).map(([key, value]) => (
                  <pre key={key} className="text-xs">
                    {key}: {JSON.stringify(value, null, 2)}
                  </pre>
                ))}
              </div>
            ) : (
              <div className="whitespace-pre-wrap">
                Running <q>{toolInvocation.toolName}</q>...
              </div>
            )}
          </div>
        )}
      </div>
    );
  };

  return (
    <div className={`flex ${isUser ? "justify-end" : "justify-start"} mb-4`}>
      <div
        className={`max-w-[85%] rounded-lg px-4 py-3 shadow-sm ${
          isUser
            ? "bg-blue-500 text-white"
            : "bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
        }`}
      >
        {parts && parts.length > 0 && (
          <div className="space-y-2 max-w-full overflow-y-auto mb-2">
            {parts.map((part, index) => (
              <React.Fragment key={index}>
                {part.type === "tool-invocation" && renderToolInvocation(part)}
              </React.Fragment>
            ))}
          </div>
        )}
        {content?.length ? (
          <div
            className={`prose text-lg/8 font-light ${
              !isUser ? "prose-dark" : "prose-invert"
            } max-w-none`}
          >
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              rehypePlugins={[rehypeHighlight]}
              components={{
                pre: ({ node, ...props }) => (
                  <pre
                    className="bg-gray-900 text-gray-100 rounded p-3 overflow-auto text-sm"
                    {...props}
                  />
                ),
                code: ({ inline, className, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code
                        className={`${className} bg-gray-800 text-gray-200 px-1 py-0.5 rounded text-sm`}
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
        ) : null}
      </div>
    </div>
  );
}
