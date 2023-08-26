"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";

import PromptButtons from "./page-components/PromptSection";

import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();

  const [jsonInput, setJsonInput] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [isBlankSlateVisible, setBlankSlateVisible] = useState(false);

  const handleJsonInputChange = (newValue: string) => {
    setJsonInput(newValue);

    try {
      JSON.parse(newValue);
      setIsValidJson(true);
    } catch (err) {
      setIsValidJson(false); // Invalid JSON detected.
    }
  };

  const handleBeautify = () => {
    if (isValidJson) {
      const beautified = JSON.stringify(JSON.parse(jsonInput), null, 2);
      setFormattedJson(beautified);
    } else {
      alert("Please enter valid JSON.");
    }
  };

  return (
    <div className="flex flex-col w-screen h-screen justify-between">
      <AnimatePresence>
        {isBlankSlateVisible && (
          <motion.div
            initial={{ y: "-100%" }}
            animate={{ y: 0 }}
            exit={{ y: "-100%" }}
            transition={{ duration: 0.5 }}
            onClick={() => setBlankSlateVisible(false)}
            className="flex items-center justify-center h-[80px] bg-gray-800 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M5 10l7-7m0 0l7 7m-7-7v18"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>

      {!isBlankSlateVisible ? (
        <div className="flex flex-row space-x-8 h-4/5 justify-center items-center">
          <AceEditor
            mode="json"
            theme="monokai"
            value={jsonInput}
            onChange={handleJsonInputChange}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
            className="w-1/2 h-96"
          />

          <button
            onClick={handleBeautify}
            className="self-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
          >
            Beautify
          </button>

          <AceEditor
            mode="json"
            theme="monokai"
            value={formattedJson}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
            className="w-1/2 h-96"
          />
        </div>
      ) : (
        <div className="h-4/5">
          <div className="flex flex-col w-full max-w-md py-24 mx-auto h-full justify-between">
            {/* Messages Section */}
            <div className="flex-1 overflow-y-auto">
              {messages.length > 0
                ? messages.map((m) => (
                    <div key={m.id} className="whitespace-pre-wrap">
                      {m.role === "user" ? "User: " : "AI: "}
                      {m.content}
                    </div>
                  ))
                : null}
            </div>

            {/* Cards & Form Section */}
            <PromptButtons
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
            />
          </div>
        </div>
      )}

      <AnimatePresence>
        {!isBlankSlateVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            onClick={() => setBlankSlateVisible(true)}
            className="flex items-center justify-center h-[80px] bg-gray-800 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6 text-white"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 14l-7 7m0 0l-7-7m7 7V3"
              />
            </svg>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
