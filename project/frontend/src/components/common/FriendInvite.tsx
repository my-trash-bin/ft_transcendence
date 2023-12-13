import { create } from 'zustand';

interface FriendInviteStore {
  isInviteOpen: boolean;
  gameMode: 'normal' | 'item';
  setIsInviteOpen: (isOpen: boolean) => void;
  closeInvite: () => void;
  setGameMode: (mode: 'normal' | 'item') => void;
}

const useFriendInviteStore = create<FriendInviteStore>((set) => {
  return {
    isInviteOpen: false,
    gameMode: 'normal',
    setIsInviteOpen: (isOpen) => set({ isInviteOpen: isOpen }),
    closeInvite: () => set({ isInviteOpen: false }),
    setGameMode: (mode) => set({ gameMode: mode }),
  };
});

export default useFriendInviteStore;
