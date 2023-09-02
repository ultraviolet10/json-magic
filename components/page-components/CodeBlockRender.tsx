import { useEffect, useState } from "react";
import CheckFat from "@phosphor-icons/react/dist/icons/CheckFat";
import Copy from "@phosphor-icons/react/dist/icons/Copy";

interface CodeBlockRenderProps {
  code: string | null;
  note?: string;
}

const CodeBlockRender: React.FC<CodeBlockRenderProps> = ({ code }) => {
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (copied) {
      const interval = setTimeout(() => setCopied(false), 1000);
      return () => clearTimeout(interval);
    }
  }, [copied]);
  
  return (
    <>
      <code className="bg-gray-100 p-4 rounded-md font-mono whitespace-pre-wrap overflow-x-auto">
        {code}
      </code>
      <div className="flex flex-col gap-1 flex-grow-0 flex-shrink-0 bg-gray-100">
        <button
          type="button"
          className="rounded-md p-1 text-emerald-900 hover:bg-emerald-200 border-2 border-emerald-200 transition-colors"
          aria-label="copy code to clipboard"
          title="Copy code to clipboard"
          onClick={() => {
            navigator.clipboard.writeText(code ?? "");
            setCopied(true);
          }}
        >
          {copied ? (
            <CheckFat className="w-4 h-4" />
          ) : (
            <Copy className="w-4 h-4" />
          )}
        </button>
      </div>
    </>
  );
};

export default CodeBlockRender;
