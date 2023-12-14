import { create } from 'zustand';

interface Toast {
  isBan: boolean;
  openIsBan: () => void;
  closeIsBan: () => void;
  isFull: boolean;
  openIsFull: () => void;
  closeIsFull: () => void;
  isInvalidPassword: boolean;
  openIsInvalidPassword: () => void;
  closeIsInvalidPassword: () => void;
  isSuccessChangeChannnal: boolean;
  openSuccessChangeChannnal: () => void;
  closeSuccessChangeChannnal: () => void;
  isFailChangeChannnal: boolean;
  openFailChangeChannnal: () => void;
  closeFailChangeChannnal: () => void;
  isMute: boolean;
  openIsMute: () => void;
  closeIsMute: () => void;
  isOut: boolean;
  openIsOut: () => void;
  closeIsOut: () => void;
  isKick: boolean;
  openIsKick: () => void;
  closeIsKick: () => void;
  isPromote: boolean;
  openIsPromote: () => void;
  closeIsPromote: () => void;
  isKickUser: boolean;
  openIsKickUser: () => void;
  closeIsKickUser: () => void;
  isBanUser: boolean;
  openIsBanUser: () => void;
  closeIsBanUser: () => void;
  isMuteUser: boolean;
  openIsMuteUser: () => void;
  closeIsMuteUser: () => void;
  isPromoteUser: boolean;
  openIsPromoteUser: () => void;
  closeIsPromoteUser: () => void;
}

const useToast = create<Toast>((set) => {
  return {
    isBan: false,
    openIsBan: () => set({ isBan: true }),
    closeIsBan: () => set({ isBan: false }),
    isFull: false,
    openIsFull: () => set({ isFull: true }),
    closeIsFull: () => set({ isFull: false }),
    isInvalidPassword: false,
    openIsInvalidPassword: () => set({ isInvalidPassword: true }),
    closeIsInvalidPassword: () => set({ isInvalidPassword: false }),
    isSuccessChangeChannnal: false,
    openSuccessChangeChannnal: () => set({ isSuccessChangeChannnal: true }),
    closeSuccessChangeChannnal: () => set({ isSuccessChangeChannnal: false }),
    isFailChangeChannnal: false,
    openFailChangeChannnal: () => set({ isFailChangeChannnal: true }),
    closeFailChangeChannnal: () => set({ isFailChangeChannnal: false }),
    isMute: false,
    openIsMute: () => set({ isMute: true }),
    closeIsMute: () => set({ isMute: false }),
    isOut: false,
    openIsOut: () => set({ isOut: true }),
    closeIsOut: () => set({ isOut: false }),
    isKick: false,
    openIsKick: () => set({ isKick: true }),
    closeIsKick: () => set({ isKick: false }),
    isPromote: false,
    openIsPromote: () => set({ isPromote: true }),
    closeIsPromote: () => set({ isPromote: false }),
    isKickUser: false,
    openIsKickUser: () => set({ isKickUser: true }),
    closeIsKickUser: () => set({ isKickUser: false }),
    isBanUser: false,
    openIsBanUser: () => set({ isBanUser: true }),
    closeIsBanUser: () => set({ isBanUser: false }),
    isMuteUser: false,
    openIsMuteUser: () => set({ isMuteUser: true }),
    closeIsMuteUser: () => set({ isMuteUser: false }),
    isPromoteUser: false,
    openIsPromoteUser: () => set({ isPromoteUser: true }),
    closeIsPromoteUser: () => set({ isPromoteUser: false }),
  };
});

export default useToast;
