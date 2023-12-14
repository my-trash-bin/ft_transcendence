import { create } from 'zustand';

interface NotAllowedPong {
  isOpen: boolean;
  OpenToast: () => void;
  closeToast: () => void;
}

const useNotAllowedPong = create<NotAllowedPong>((set) => {
  return {
    isOpen: false,
    OpenToast: () => set({ isOpen: true }),
    closeToast: () => set({ isOpen: false }),
  };
});

export default useNotAllowedPong;
