"use client";

import { extractLawText, processLawText } from "@/lib/actions/et-laws";
import type { EtLawsChunk } from "@/lib/types/et-laws-chunk";
import { useState } from "react";

export default function LawParserPage() {
  const [pdfUrl, setPdfUrl] = useState<string>("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [extractedText, setExtractedText] = useState<string | null>(null);
  const [chunks, setChunks] = useState<EtLawsChunk[] | null>(null);

  async function handleExtract(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    setExtractedText(null);
    setChunks(null);

    try {
      const response = await extractLawText(pdfUrl);
      if (response.success && response.text) {
        setExtractedText(response.text);
      } else {
        throw new Error(
          response.error || "Failed to extract text from document"
        );
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    }
    setIsLoading(false);
  }

  async function handleProcess() {
    if (!extractedText) return;

    setIsLoading(true);
    setError(null);
    setChunks(null);

    try {
      const response = await processLawText(extractedText);
      if (response.success && response.chunks) {
        setChunks(response.chunks);
        console.log(response.chunks);
        console.log(JSON.stringify(response.chunks, null, 2));
      } else {
        throw new Error(response.error || "Failed to process text");
      }
    } catch (e) {
      console.error(e);
      setError(e instanceof Error ? e.message : "An unknown error occurred");
    }
    setIsLoading(false);
  }

  return (
    <div className="container mx-auto px-4 py-12 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8 text-center">
        Law Document Parser
      </h1>

      {!extractedText && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <form className="space-y-4" onSubmit={handleExtract}>
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8">
              <div className="flex flex-col space-y-4">
                <label className="block">
                  <span className="text-gray-700 dark:text-gray-200 mb-2 block">
                    Enter PDF Document URL
                  </span>
                  <input
                    type="url"
                    value={pdfUrl}
                    onChange={(e) => setPdfUrl(e.target.value)}
                    placeholder="https://example.com/document.pdf"
                    className="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                  />
                </label>
                <div className="flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5 mr-2"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                    />
                  </svg>
                  <span>URL must point directly to a PDF file</span>
                </div>
              </div>
            </div>

            <div className="flex justify-center">
              <button
                type="submit"
                disabled={isLoading || !pdfUrl}
                className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
              >
                {isLoading ? (
                  <div className="flex items-center">
                    <svg
                      className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                    >
                      <circle
                        className="opacity-25"
                        cx="12"
                        cy="12"
                        r="10"
                        stroke="currentColor"
                        strokeWidth="4"
                      ></circle>
                      <path
                        className="opacity-75"
                        fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                      ></path>
                    </svg>
                    Extracting...
                  </div>
                ) : (
                  "Extract Text"
                )}
              </button>
            </div>
          </form>
        </div>
      )}

      {error && (
        <div
          className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 mb-8 rounded-lg"
          role="alert"
        >
          <p className="font-bold">Error</p>
          <p>{error}</p>
        </div>
      )}

      {extractedText && !chunks && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Edit Extracted Text</h2>
          <div className="mb-4">
            <textarea
              className="w-full h-96 p-3 border border-gray-300 dark:border-gray-600 rounded-lg dark:bg-gray-700 dark:text-gray-200"
              value={extractedText}
              onChange={(e) => setExtractedText(e.target.value)}
            ></textarea>
            <div className="text-sm text-gray-500 dark:text-gray-400">
              {Intl.NumberFormat("en-US").format(
                extractedText
                  .split(/[\s\n]+/)
                  .map((w) => w.trim())
                  .filter(Boolean).length
              )}{" "}
              words
            </div>
          </div>

          <div className="flex justify-between">
            <button
              onClick={() => setExtractedText(null)}
              className="bg-gray-500 hover:bg-gray-600 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Back
            </button>
            <button
              onClick={handleProcess}
              disabled={isLoading}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-6 rounded-lg disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? (
                <div className="flex items-center">
                  <svg
                    className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    ></circle>
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    ></path>
                  </svg>
                  Processing...
                </div>
              ) : (
                "Process Text"
              )}
            </button>
          </div>
        </div>
      )}

      {chunks && (
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-semibold">Parsed Results</h2>
            <button
              onClick={() => {
                setChunks(null);
              }}
              className="bg-gray-500 hover:bg-gray-600 text-white py-1 px-3 rounded-lg text-sm transition-colors"
            >
              Back to Editor
            </button>
          </div>

          <div className="overflow-auto max-h-[600px]">
            {chunks.map((chuck, index) => (
              <div key={index} className="mb-8 border-b pb-6 last:border-b-0">
                <div className="mb-4">
                  <h3 className="text-lg font-medium">
                    Part {chuck.partNumber}: {chuck.partTitle}
                  </h3>
                  <h4 className="text-md font-medium mt-2">
                    Section {chuck.sectionNumber}: {chuck.sectionTitle}
                  </h4>
                  <p className="mt-2 text-gray-700 dark:text-gray-300">
                    {chuck.content}
                  </p>
                </div>

                {chuck.subsections.length > 0 && (
                  <div className="pl-6 border-l-2 border-gray-200 dark:border-gray-700">
                    <h5 className="font-medium mb-2">Subsections:</h5>
                    <RenderSubsections subsections={chuck.subsections} />
                  </div>
                )}
              </div>
            ))}
          </div>

          <div className="mt-6 flex space-x-4">
            <button
              onClick={() => {
                const jsonString = JSON.stringify(chunks, null, 2);
                const blob = new Blob([jsonString], {
                  type: "application/json",
                });
                const url = URL.createObjectURL(blob);
                const a = document.createElement("a");
                a.href = url;
                a.download = "parsed_law_document.json";
                document.body.appendChild(a);
                a.click();
                document.body.removeChild(a);
                URL.revokeObjectURL(url);
              }}
              className="bg-green-600 hover:bg-green-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Download JSON
            </button>
            <button
              onClick={() => {
                const jsonString = JSON.stringify(chunks, null, 2);
                navigator.clipboard
                  .writeText(jsonString)
                  .then(() => {
                    alert("Copied to clipboard");
                  })
                  .catch((err) => {
                    console.error("Failed to copy: ", err);
                    alert("Failed to copy to clipboard");
                  });
              }}
              className="bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-lg transition-colors"
            >
              Copy to Clipboard
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

function RenderSubsections({
  subsections,
  depth = 0,
}: {
  subsections: any[];
  depth?: number;
}) {
  if (!subsections || subsections.length === 0) return null;

  return (
    <ul className={`space-y-3 ${depth > 0 ? "pl-4" : ""}`}>
      {subsections.map((subsection, index) => (
        <li
          key={index}
          className="border-l-2 border-gray-200 dark:border-gray-700 pl-4 py-1"
        >
          <div className="font-medium">
            Subsection {subsection.subsectionNumber}
          </div>
          <p className="text-gray-700 dark:text-gray-300 mt-1">
            {subsection.subsectionContent}
          </p>

          {subsection.subsections && subsection.subsections.length > 0 && (
            <div className="mt-2">
              <RenderSubsections
                subsections={subsection.subsections}
                depth={depth + 1}
              />
            </div>
          )}
        </li>
      ))}
    </ul>
  );
}
