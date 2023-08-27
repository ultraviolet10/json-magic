import React, { FC } from "react";
import { motion } from "framer-motion";

import { Card, CardDescription } from "@/components/ui/card";

import { PromptSubject } from "@/types/common";

interface PromptSubjectButtonProps {
  subject: PromptSubject | string;
  text: string;
  onClick: () => void;
}

const PromptSubjectButton: FC<PromptSubjectButtonProps> = ({
  subject,
  onClick,
  text,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      <Card
        className="flex w-full h-[40px] items-center justify-center cursor-pointer"
        onClick={onClick}
      >
        <CardDescription>{text}</CardDescription>
      </Card>
    </motion.div>
  );
};

export default PromptSubjectButton;
