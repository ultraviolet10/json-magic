"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";

import PromptSection from "../components/page-components/PromptSection/PromptSection";
import AnalysisPanel from "@/components/page-components/AnalysisPanel";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-terminal";
import { Range } from "ace-builds";
import "../ext-styles/common.css";

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const editorRef = useRef<AceEditor | null>(null);

  const [validJson, setValidJson] = useState<boolean>(false);
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
  const [jsonInput, setJsonInput] = useState<string>("");
  const [formattedJson, setFormattedJson] = useState<string>("");
  const [isBlankSlateVisible, setBlankSlateVisible] = useState(false);
  const [isPanelVisible, setPanelVisible] = useState<boolean>(false);

  const handleJsonInputChange = (newValue: string) => {
    setJsonInput(newValue);

    try {
      JSON.parse(newValue);
      setValidJson(true);
    } catch (err) {
      setValidJson(false);
      alert("shitty json");
    }
  };

  const handleAnalysis = () => {
    setPanelVisible(true);
  };

  const handleBeautify = () => {
    if (validJson) {
      const beautified = JSON.stringify(JSON.parse(jsonInput), null, 2);
      setFormattedJson(beautified);
    } else {
      alert("Please enter valid JSON.");
    }
  };

  const handleClosePanel = () => setPanelVisible(false);

  useEffect(() => {
    if (editorRef.current) {
      const editor = editorRef.current.editor;
      const session = editor.getSession();

      // Clear existing markers
      const markers = session.getMarkers();
      for (const id in markers) {
        if (markers[id].clazz === "highlight-marker") {
          session.removeMarker(markers[id].id);
        }
      }

      // Set new markers
      highlightedLines.forEach((line) => {
        session.addMarker(
          new Range(line, 0, line + 1, 0),
          "highlight-marker",
          "fullLine"
        );
      });
    }
  }, [highlightedLines, editorRef]);

  return (
    <div className="flex flex-col w-screen h-screen justify-between bg-[#2d99a5]">
      <AnimatePresence>
        {isBlankSlateVisible && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ duration: 0.5 }}
            onClick={() => setBlankSlateVisible(false)}
            className="flex flex-row items-center justify-center space-x-4 h-[80px] bg-gray-800 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
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
            <span className="text-white font-ligo text-[20px]">{`✨ Ask me anything`}</span>
          </motion.div>
        )}
        <AnalysisPanel
          isVisible={isPanelVisible}
          handleClose={handleClosePanel}
          jsonData={jsonInput}
        />
      </AnimatePresence>

      {!isBlankSlateVisible ? (
        <div className="flex flex-row space-x-8 h-4/5 justify-center items-center">
          <AceEditor
            mode="json"
            name="absorb"
            theme="terminal"
            value={jsonInput}
            onChange={handleJsonInputChange}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
            className="w-1/2 h-96"
          />

          <div className="flex flex-col items-center justify-center space-y-8">
            <button
              onClick={handleBeautify}
              className="self-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Beautify
            </button>

            <button
              onClick={handleAnalysis}
              className="self-center bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Analyse
            </button>
          </div>

          <AceEditor
            mode="json"
            name="leaf_blade"
            theme="terminal"
            value={formattedJson}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
            highlightActiveLine={true}
            className="w-1/2 h-96"
            ref={editorRef}
          />
        </div>
      ) : (
        <div className="h-[90%]">
          <div className="flex flex-col w-full max-w-md py-24 mx-auto h-full justify-between">
            <div className="flex flex-col h-[800px] overflow-y-auto border border-dark-200 rounded-lg mb-5">
              {messages.length > 0
                ? messages.map((m) => (
                    <div key={m.id} className="whitespace-pre-wrap">
                      {m.role === "user" ? "User: " : "AI: "}
                      {m.content}
                    </div>
                  ))
                : null}
            </div>

            <PromptSection
              input={input}
              handleInputChange={handleInputChange}
              handleSubmit={handleSubmit}
              payload={formattedJson}
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
            className="flex flex-row items-center justify-center space-x-4 h-[80px] bg-gray-800 cursor-pointer"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-4 w-4 text-white"
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
            <span className="text-white font-ligo text-[20px]">{`✨ Ask me anything`}</span>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
