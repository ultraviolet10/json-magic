"use client";

import { useChat } from "ai/react";
import { useState } from "react";
import AceEditor from "react-ace";

import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-monokai";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const [jsonInput, setJsonInput] = useState<string>("");
  const [isValidJson, setIsValidJson] = useState<boolean>(true);
  const [formattedJson, setFormattedJson] = useState<string>("");

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
      const beautified = JSON.stringify(JSON.parse(jsonInput), null, 2); // Use 2 spaces for indentation
      setFormattedJson(beautified);
    } else {
      alert("Please enter valid JSON.");
    }
  };
  return (
    <div className="flex flex-col w-screen py-4 h-screen items-center justify-center">
      {/* {messages.length > 0
        ? messages.map(m => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === 'user' ? 'User: ' : 'AI: '}
              {m.content}
            </div>
          ))
        : null} */}
      <div className="flex flex-row w-full h-full space-x-10">
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

      {messages.length > 0
        ? messages.map((m) => (
            <div key={m.id} className="whitespace-pre-wrap">
              {m.role === "user" ? "User: " : "AI: "}
              {m.content}
            </div>
          ))
        : null}
      <form onSubmit={handleSubmit}>
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
}
