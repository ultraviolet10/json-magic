interface CodeBlockRenderProps {
  code: string;
  note?: string;
}

const CodeBlockRender: React.FC<CodeBlockRenderProps> = ({ code, note }) => {
  return (
    <div className="my-4">
      <pre className="bg-gray-100 p-4 rounded-md font-mono whitespace-pre-wrap overflow-x-auto">
        {code}
      </pre>
      {note && <p className="text-red-600 italic mt-2">{note}</p>}
    </div>
  );
};

export default CodeBlockRender;
