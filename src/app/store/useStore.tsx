import { create } from "zustand";

interface StoreState {
  data: any[]; // 可以根据实际数据结构替换 `any`
  currentPage: string;
  numbers: string[];
  chooseRedNumber: string[];
  chooseBlueNumber: string[];
  setNumbers: (newNumbers: string[]) => void;
  setData: (newData: any[]) => void; // 根据实际数据结构替换 `any`
  setCurrentPage: (page: string) => void;
  setChooseRedNumber: (newNumbers: string[]) => void;
  setChooseBlueNumber: (newNumbers: string[]) => void;
}

const useStore = create<StoreState>((set) => ({
  data: [],
  currentPage: "recordList",
  numbers: [],
  chooseRedNumber: [],
  chooseBlueNumber: [],
  setNumbers: (newNumbers) => set({ numbers: newNumbers }),
  setData: (newData) => set({ data: newData }),
  setCurrentPage: (page) => set({ currentPage: page }),
  setChooseRedNumber: (newNumbers) => set({ chooseRedNumber: newNumbers }),
  setChooseBlueNumber: (newNumbers) => set({ chooseBlueNumber: newNumbers }),
}));

export default useStore;
