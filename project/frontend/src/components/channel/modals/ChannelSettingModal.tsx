import { ParticipantModal } from '@/components/channel/modals/ParticipantModal';
import { SettingModal } from '@/components/channel/modals/SettingModal';
import { useState } from 'react';
import { ModalLayout } from './ModalLayout';

enum ModalType {
  PARTICIPANT = 'PARTICIPANT',
  SETTING = 'SETTING',
  ADD = 'ADD',
}

const getModalContent = (
  modalType: ModalType,
  closeModal: () => void,
  setModalType: any,
  channelId: string,
  myAuthority: string,
  myNickname: any,
) => {
  const setModalParticipant = () => {
    setModalType(ModalType.PARTICIPANT);
  };
  const setModalSetting = () => {
    setModalType(ModalType.SETTING);
  };
  const setModalAdd = () => {
    setModalType(ModalType.ADD);
  };
  const modalStateFunctions = {
    setModalParticipant,
    setModalSetting,
    setModalAdd,
  };
  switch (modalType) {
    case ModalType.PARTICIPANT:
      return (
        <ParticipantModal
          closeModal={closeModal}
          modalStateFunctions={modalStateFunctions}
          channelId={channelId}
          myAuthority={myAuthority}
          myNickname={myNickname}
        />
      );
    case ModalType.SETTING:
      return (
        <SettingModal
          channelId={channelId}
          closeModal={closeModal}
          modalStateFunctions={modalStateFunctions}
        />
      );
  }
};

export function ChannelSettingModal({
  isOpen,
  closeModal,
  channelId,
  myAuthority,
  myNickname,
}: {
  isOpen: boolean;
  closeModal: () => void;
  channelId: string;
  myAuthority: string;
  myNickname: any;
}) {
  const [modalType, setModalType] = useState(ModalType.PARTICIPANT);
  const modalCloseAndSetParticipant = () => {
    closeModal();
    setModalType(ModalType.PARTICIPANT);
  };
  const modalContent = getModalContent(
    modalType,
    modalCloseAndSetParticipant,
    setModalType,
    channelId,
    myAuthority,
    myNickname,
  );
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={modalCloseAndSetParticipant}
      width="350px"
      height="500px"
    >
      {modalContent}
    </ModalLayout>
  );
}
