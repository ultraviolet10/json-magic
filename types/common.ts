export enum PromptSubject {
  FRONTEND = "frontend",
  BACKEND = "backend",
  SMART_CONTRACT = "SC",
}

export interface SimpleJsonTreeNode {
  key?: string | number;
  value?: any;
  children?: SimpleJsonTreeNode[];
}
