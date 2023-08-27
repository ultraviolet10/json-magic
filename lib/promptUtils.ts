import { PromptSubject } from "@/types/common";

export enum PromptState {
  // @todo figure out tf
  INITIAL = "INITIAL",
  FRONTEND = "frontend",
  // Additional states...
}

export const optionsMap = {
  [PromptState.INITIAL]: [
    { key: PromptSubject.FRONTEND, text: "Frontend Parsing" },
    { key: PromptSubject.BACKEND, text: "Backend Support" },
    { key: PromptSubject.SMART_CONTRACT, text: "Solidity Representation" },
  ],
  [PromptState.FRONTEND]: [
    { key: "react", text: "React/Next" },
    { key: "vite", text: "Vite" },
    { key: "angular", text: "Angular" },
  ],
  // Add options for other states.
};

export const descriptionMap = {
  [PromptState.INITIAL]: "What would you like to achieve with your JSON?",
  [PromptState.FRONTEND]: "Which framework are you working with?",
  // Add descriptions for other states.
};

export type PromptMapType = {
  [key: string]: string;
};

export const promptMap: PromptMapType = {
  react:
    "How can I optimally parse the following JSON in a React/Next.js application?",
  vite: "How can I optimally parse the following JSON in a Vite application?",
  angular:
    "How can I optimally parse the following JSON in an Angular application?",
  // Add other backend, smart contract, and potential options.
};
