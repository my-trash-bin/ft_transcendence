import { create } from 'zustand';

interface NewFriend {
  isNewFriendOpen: boolean;
  friendName?: string;
  setFriendName: (name: string) => void;
  openNewFriend: () => void;
  closeNewFriend: () => void;
}

const useNewFriend = create<NewFriend>((set) => {
  return {
    isNewFriendOpen: false,
    setFriendName: (name: string) => set({ friendName: name }),
    openNewFriend: () => set({ isNewFriendOpen: true }),
    closeNewFriend: () => set({ isNewFriendOpen: false }),
  };
});

export default useNewFriend;
