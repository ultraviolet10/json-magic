"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useChat } from "ai/react";
import { useToast } from "@/components/ui/use-toast";

import PromptSection from "./page-components/PromptSection/PromptSection";

import AceEditor from "react-ace";
import "ace-builds/src-noconflict/mode-json";
import "ace-builds/src-noconflict/theme-terminal";
import { Range } from "ace-builds";
import "../ext-styles/common.css";

interface JsonValue {
  [key: string]: any;
}

export default function Chat() {
  const { messages, input, handleInputChange, handleSubmit } = useChat();
  const { toast } = useToast();
  const editorRef = useRef<AceEditor | null>(null);

  const [jsonTree, setJsonTree] = useState<any>(null);
  const [analysisFeedback, setAnalysisFeedback] = useState<string>("");
  const [highlightedLines, setHighlightedLines] = useState<number[]>([]);
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

  const handleAnalysis = () => {
    if (isValidJson) {
      const parsedJson = JSON.parse(jsonInput);

      // Flag null/undefined values
      const nullPaths: string[] = [];
      const recurseJson = (obj: JsonValue | any[], currentPath = "") => {
        Object.entries(obj).forEach(([key, value]) => {
          if (value === null || value === undefined) {
            nullPaths.push(currentPath + key);
          } else if (typeof value === "object") {
            recurseJson(value, currentPath + key + ".");
          }
        });
      };
      recurseJson(parsedJson);
      // Highlighting logic
      const computeLineNumber = (jsonString: string, path: string) => {
        const keys = path.split(".");
        let pattern = jsonString;
        for (const key of keys) {
          const regExPattern = new RegExp(`"${key}"\\s*:`, "m");
          const match = regExPattern.exec(pattern);
          if (!match) return -1;
          pattern = pattern.substring(match.index);
        }
        return (
          jsonString.substring(0, jsonString.indexOf(pattern)).match(/\n/g) ||
          []
        ).length;
      };

      const linesToHighlight = nullPaths.map((path) =>
        computeLineNumber(jsonInput, path.split(".").pop() || "")
      );
      setHighlightedLines(linesToHighlight);

      // Construct JSON Tree
      setJsonTree(parsedJson); // This assumes you have a component or method to display this tree in your UI.

      // Description of JSON (for now, simple description)
      const type = Array.isArray(parsedJson) ? "array" : "object";
      const details = Array.isArray(parsedJson)
        ? `with ${parsedJson.length} items`
        : `with keys [${Object.keys(parsedJson).join(", ")}]`;

      const promptDescription = `The provided JSON is an ${type} ${details}.`;
      setAnalysisFeedback(promptDescription);

      // @todo Use GPT-3.5 for more detailed, context-rich descriptions if needed.
    } else {
      alert("Please enter valid JSON.");
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
            name="absorb"
            theme="terminal"
            value={jsonInput}
            onChange={handleJsonInputChange}
            editorProps={{ $blockScrolling: true }}
            setOptions={{
              showLineNumbers: true,
              tabSize: 2,
            }}
            highlightActiveLine={true}
            className="w-1/2 h-96"
          />

          <div className="flex flex-col items-center justify-center space-y-8">
            <button
              onClick={() => {
                handleBeautify();
                toast({
                  description: "Done!",
                });
              }}
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
