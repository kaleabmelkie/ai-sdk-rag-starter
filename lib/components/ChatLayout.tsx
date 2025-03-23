import React from "react";

type ChatLayoutProps = {
  header?: React.ReactNode;
  messageList: React.ReactNode;
  inputArea: React.ReactNode;
};

export function ChatLayout({
  header,
  messageList,
  inputArea,
}: ChatLayoutProps) {
  return (
    <div className="flex flex-col h-screen bg-gray-50 dark:bg-gray-950">
      {header && (
        <header className="border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-4">
          {header}
        </header>
      )}

      <main className="flex-1 overflow-y-auto px-4 py-4">
        <div className="max-w-4xl mx-auto h-full">{messageList}</div>
      </main>

      <footer className="border-t border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900 py-4 px-4">
        <div className="max-w-4xl mx-auto">{inputArea}</div>
      </footer>
    </div>
  );
}
