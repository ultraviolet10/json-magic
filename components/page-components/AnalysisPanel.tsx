import { ChangeEvent, FormEvent, useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { CardDescription } from "../ui/card";
import { generateJSONSchema, generateSimpleJsonTree } from "@/lib/tool";
import ReactJson from "react-json-view";
import { Button } from "../ui/button";
import { useChat } from "ai/react";
import { Message } from "ai";

interface AnalysisPanelProps {
  isVisible: boolean;
  handleClose: () => void;
  jsonData: any;
}

const AnalysisPanel: React.FC<AnalysisPanelProps> = ({
  isVisible,
  handleClose,
  jsonData,
}) => {
  const { messages, handleInputChange, handleSubmit } = useChat();

  const [jsonSchema, setJsonSchema] = useState({});
  const [jsonTree, setJsonTree] = useState({});
  const [responseMessage, setResponseMessage] = useState<string | null>(null);

  const formRef = useRef<HTMLFormElement>(null);

  useEffect(() => {
    if (jsonData) {
      const schema = generateJSONSchema(JSON.parse(jsonData));
      const tree = generateSimpleJsonTree(JSON.parse(jsonData));

      setJsonSchema(schema);
      setJsonTree(tree);
    }
  }, [jsonData]);

  const extractResponseFromMessages = (messages: Message[]) => {
    for (const message of messages) {
      if (
        message.role ===
        "assistant" /* && (any additional criteria if needed) */
      ) {
        console.log("??", message.content);
        setResponseMessage(message.content);
        break; // If you only expect one such message, break out of the loop once found
      }
    }
  };

  useEffect(() => {
    extractResponseFromMessages(messages);
  }, [messages]);

  const variants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
  };

  const handleLocalSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    handleSubmit(e);
  };

  const handleTypesButtonClick = () => {
    const typeQuery = `Given the JSON schema:

    ${JSON.stringify(jsonSchema, null, 2)}
    
    Please generate TypeScript typings using interfaces, types, and enums. Ensure efficient and valid type definitions and handle null values accordingly.
    Show me just the code.
        `;
    handleInputChange({
      target: { value: typeQuery },
    } as ChangeEvent<HTMLInputElement>);

    console.log({ messages });
  };

  return (
    <>
      <motion.div
        initial={{ opacity: 0 }}
        animate={isVisible ? { opacity: 0.7 } : { opacity: 0 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.5 }}
        onClick={handleClose}
        className="fixed top-0 left-0 w-full h-full z-40 pointer-events-none bg-[#284564]"
      />

      <motion.div
        variants={variants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        exit="hidden"
        transition={{ duration: 0.5 }}
        className="fixed right-0 top-0 h-full w-1/3 bg-gray-300 shadow-lg overflow-y-auto z-50 rounded-l-lg"
      >
        <div className="flex flex-col p-4 space-y-6">
          <div className="flex flex-row justify-between items-center">
            <CardDescription className="text-[25px] font-ligo">
              Analysis
            </CardDescription>
            <button onClick={handleClose}>{`>>>`}</button>
          </div>

          {jsonData ? (
            <div className="flex flex-col space-y-4 items-start w-full">
              <div className="flex flex-col space-y-2 items-start w-full">
                <div className="flex flex-row justify-between items-center w-full">
                  <CardDescription className="text-[20px] text-black font-ligo">
                    JSON Schema
                  </CardDescription>
                  <form ref={formRef} onSubmit={handleLocalSubmit}>
                    <Button
                      className="font-ligo text-black"
                      variant="secondary"
                      onClick={handleTypesButtonClick}
                      type="submit"
                    >
                      Types
                    </Button>
                  </form>
                </div>
                <div className="w-full flex flex-col space-y-4 items-center justify-center">
                  <ReactJson
                    src={jsonSchema}
                    collapsed={2}
                    enableClipboard={true}
                    name={null}
                    theme="threezerotwofour"
                  />
                  <div className="flex flex-col h-[200px] w-full overflow-y-auto border border-dark-200 rounded-lg">
                    {messages.length > 0
                      ? messages.map((m) => (
                          <div key={m.id} className="whitespace-pre-wrap">
                            {m.role === "user" ? "User: " : "AI: "}
                            {m.content}
                          </div>
                        ))
                      : null}
                  </div>
                </div>
              </div>
              <div className="flex flex-col space-y-2 items-start w-full">
                <CardDescription className="text-[20px] text-black font-ligo">
                  JSON Tree
                </CardDescription>
                <div className="w-full">
                  <ReactJson
                    src={jsonTree}
                    collapsed={2}
                    enableClipboard={true}
                    name={null}
                    theme="threezerotwofour"
                  />
                </div>
              </div>
            </div>
          ) : (
            <pre>{`No json to analyse :(`}</pre>
          )}
        </div>
      </motion.div>
    </>
  );
};

export default AnalysisPanel;
