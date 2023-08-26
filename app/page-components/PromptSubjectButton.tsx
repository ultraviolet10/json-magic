import React, { FC } from "react";
import { Card, CardDescription } from "@/components/ui/card";

import { PromptSubject } from "@/types/common";

interface PromptSubjectButtonProps {
  subject: PromptSubject;
}

const PromptSubjectButton: FC<PromptSubjectButtonProps> = ({ subject }) => {
  let description: string;
  switch (subject) {
    case PromptSubject.FRONTEND:
      description = "Frontend Parsing";
      break;
    case PromptSubject.BACKEND:
      description = "Backend Support";
      break;
    case PromptSubject.SMART_CONTRACT:
      description = "Solidity Representation";
      break;
    default:
      description = "";
  }

  return (
    <Card className="flex w-full h-[40px] items-center justify-center">
      <CardDescription>{description}</CardDescription>
    </Card>
  );
};

export default PromptSubjectButton;
