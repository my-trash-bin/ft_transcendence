import { create } from 'zustand';

interface Toast {
  message?: string;
  openMessage: (message: string) => void;
  closeMessage: () => void;
}

const useToast = create<Toast>((set) => {
  return {
    openMessage: (message) => set({ message: message }),
    closeMessage: () => set({ message: undefined }),
  };
});

export default useToast;
