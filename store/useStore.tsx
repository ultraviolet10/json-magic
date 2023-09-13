import { create } from "zustand";

type JsonStoreState = {
  input: Record<string, any>;
  setInput: (newSchema: Record<string, any>) => void;
  schema: Record<string, any>;
  setSchema: (newSchema: Record<string, any>) => void;
};

const useJsonStore = create<JsonStoreState>((set) => ({
  input: {},
  schema: {},
  // setters
  setInput: (newInput) => set({ input: newInput }),
  setSchema: (newSchema) => set({ schema: newSchema }),
}));

export default useJsonStore;
