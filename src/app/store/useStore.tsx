import { create } from "zustand";

interface StoreState {
  data: any[]; // 可以根据实际数据结构替换 `any`
  currentPage: string;
  numbers: string[];
  chooseNumber: string[];
  setNumbers: (newNumbers: string[]) => void;
  setData: (newData: any[]) => void; // 根据实际数据结构替换 `any`
  setCurrentPage: (page: string) => void;
  setChooseNumbersNumber: (newNumbers: string[]) => void;
}

const useStore = create<StoreState>((set) => ({
  data: [],
  currentPage: "recordList",
  numbers: [],
  chooseNumber: [],
  setNumbers: (newNumbers) => set({ numbers: newNumbers }),
  setData: (newData) => set({ data: newData }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setChooseNumbersNumber: (newNumbers) => set({ chooseNumber: newNumbers }),
}));

export default useStore;
