import { create } from 'zustand';

interface FriendInviteStore {
  isInviteOpen: boolean;
  gameMode: 'normal' | 'item';
  setIsInviteOpen: (isOpen: boolean) => void;
  setGameMode: (mode: 'normal' | 'item') => void;
  closeInvite: () => void;
  closeAndNavigate: () => void;
}

const useFriendInviteStore = create<FriendInviteStore>((set) => {
  return {
    isInviteOpen: false,
    gameMode: 'normal',
    setIsInviteOpen: (isOpen) => set({ isInviteOpen: isOpen }),
    closeInvite: () => set({ isInviteOpen: false }),
    setGameMode: (mode) => set({ gameMode: mode }),
    closeAndNavigate: () => set({ isInviteOpen: false }),
  };
});

export default useFriendInviteStore;
