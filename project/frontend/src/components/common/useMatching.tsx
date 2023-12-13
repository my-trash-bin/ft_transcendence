import { create } from 'zustand';

interface Matching {
  isMatchingOpen: boolean;
  gameMode: 'normal' | 'item';
  openMatching: (isOpen: boolean) => void;
  closeMatching: () => void;
  setGameMode: (mode: 'normal' | 'item') => void;
}

const useMatching = create<Matching>((set) => {
  return {
    isMatchingOpen: false,
    gameMode: 'normal',
    openMatching: (isOpen) => set({ isMatchingOpen: isOpen }),
    closeMatching: () => set({ isMatchingOpen: false }),
    setGameMode: (mode) => set({ gameMode: mode }),
  };
});

export default useMatching;
