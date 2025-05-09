import { create } from 'zustand';

type NewTransactionSheetState = {
  isOpen: boolean;
  onOpen: () => void;
  onClose: () => void;
};

export const useNewTransactionSheetStore = create<NewTransactionSheetState>((set) => ({
  isOpen: false,
  onOpen: () => set({ isOpen: true }),
  onClose: () => set({ isOpen: false }),
}));
