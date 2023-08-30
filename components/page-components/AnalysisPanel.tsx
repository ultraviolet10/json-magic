import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { CardDescription } from "../ui/card";
import { generateJSONSchema } from "@/lib/tool";
import ReactJson from "react-json-view";

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
  const [jsonSchema, setJsonSchema] = useState({});

  useEffect(() => {
    if (jsonData) {
      const schema = generateJSONSchema(JSON.parse(jsonData));
      setJsonSchema(schema);
    }
  }, [isVisible, jsonData]);

  const variants = {
    hidden: { x: "100%" },
    visible: { x: 0 },
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

      {/* Analysis Panel */}
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
            <CardDescription className="text-[20px]">Analysis</CardDescription>
            <button onClick={handleClose}>{`>>>`}</button>
          </div>

          {jsonData ? (
            <div className="flex flex-col space-y-2 items-start w-full">
              <CardDescription className="text-[17px] text-black">
                JSON Schema
              </CardDescription>
              <ReactJson
                src={jsonSchema}
                collapsed={2}
                enableClipboard={true}
                name={null}
                theme="threezerotwofour"
              />
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
