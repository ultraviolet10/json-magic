import create from "zustand";

type JsonStoreState = {
  schema: Record<string, any>;
  setSchema: (newSchema: Record<string, any>) => void;
};

const useJsonStore = create<JsonStoreState>((set) => ({
  schema: {},
  setSchema: (newSchema) => set({ schema: newSchema }),
}));

export default useJsonStore;
