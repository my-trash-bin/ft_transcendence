import { create } from 'zustand';

interface Toast {
  isBan: boolean;
  openIsBan: () => void;
  closeIsBan: () => void;
  isFull: boolean;
  openIsFull: () => void;
  closeIsFull: () => void;
}

const useToast = create<Toast>((set) => {
  return {
    isBan: false,
    openIsBan: () => set({ isBan: true }),
    closeIsBan: () => set({ isBan: false }),
    isFull: false,
    openIsFull: () => set({ isFull: true }),
    closeIsFull: () => set({ isFull: false }),
  };
});

export default useToast;
