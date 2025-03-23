import React from "react";
import { ThemeToggle } from "@/lib/components/ThemeToggle";

type ChatHeaderProps = {
  title?: string;
};

export function ChatHeader({ title = "Chat" }: ChatHeaderProps) {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center space-x-2">
        <div className="flex items-center justify-center w-7 h-7 rounded-md bg-blue-100 dark:bg-blue-900">
          <svg
            className="w-4 h-4 text-blue-600 dark:text-blue-300"
            viewBox="0 0 24 24"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M8 10h8M8 14h4M12 22c5.523 0 10-4.477 10-10S17.523 2 12 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.5-.838A9.955 9.955 0 0012 22z"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
        </div>
        <h1 className="font-medium text-sm text-gray-900 dark:text-white">
          {title}
        </h1>
      </div>

      <div className="flex items-center">
        <ThemeToggle />
      </div>
    </div>
  );
}
