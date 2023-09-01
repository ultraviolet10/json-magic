import React, { FC, ChangeEvent, FormEvent, useState } from "react";
import { CardDescription } from "@/components/ui/card";
import PromptSubjectButton from "./PromptSubjectButton";
import { PromptSubject } from "@/types/common";
import {
  PromptState,
  optionsMap,
  promptMap,
  descriptionMap,
} from "@/lib/promptUtils";

interface PromptSectionProps {
  input: string;
  handleInputChange: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSubmit: (e: FormEvent<HTMLFormElement>) => void;
  payload: string | undefined;
}

const PromptSection: FC<PromptSectionProps> = ({
  input,
  handleInputChange,
  handleSubmit,
  payload,
}) => {
  const [currentState, setCurrentState] = useState<PromptState>(
    PromptState.INITIAL
  );

  const handleSubjectClick = (subject: PromptSubject | string) => {
    if (subject in optionsMap) {
      setCurrentState(subject as PromptState);
      handleSubmit({ preventDefault: () => {} } as FormEvent<HTMLFormElement>);
    } else if (typeof subject === "string" && subject in promptMap) {
      const preWrittenMessage = `${promptMap[subject]} : ${payload}`;
      handleInputChange({
        target: { value: preWrittenMessage },
      } as ChangeEvent<HTMLInputElement>);
    }
  };

  return (
    <div>
      <div className="flex flex-col space-y-4 mb-4">
        <CardDescription>{descriptionMap[currentState]}</CardDescription>
        {optionsMap[currentState].map((option) => (
          <PromptSubjectButton
            key={option.key}
            subject={option.key as PromptSubject}
            text={option.text}
            onClick={() => handleSubjectClick(option.key)}
          />
        ))}
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

export default PromptSection;
