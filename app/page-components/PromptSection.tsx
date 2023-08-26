import React, { FC, ChangeEvent, FormEvent } from "react";
import { Card, CardDescription } from "@/components/ui/card";
import PromptSubjectButton from "./PromptSubjectButton";
import { PromptSubject } from "@/types/common";

interface PromptButtonsProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
}

const PromptButtons: FC<PromptButtonsProps> = ({
  input,
  handleInputChange,
  handleSubmit,
}) => {
  // prompt builder based on
  return (
    <div>
      <div className="flex flex-col space-y-4 mb-4">
        <CardDescription>
          What would you like to achieve with your JSON?
        </CardDescription>
        <PromptSubjectButton subject={PromptSubject.FRONTEND} />
        <PromptSubjectButton subject={PromptSubject.BACKEND} />
        <PromptSubjectButton subject={PromptSubject.SMART_CONTRACT} />
      </div>
      <form onSubmit={handleSubmit} className="mt-4">
        <input
          className="fixed bottom-0 w-full max-w-md p-2 mb-8 border border-gray-300 rounded shadow-xl"
          value={input}
          placeholder="Say something..."
          onChange={handleInputChange}
        />
      </form>
    </div>
  );
};

export default PromptButtons;
