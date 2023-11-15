'use client';

import { ParticipantModal } from '@/components/channel/modals/ParticipantModal';
import { SettingModal } from '@/components/channel/modals/SettingModal';
import { useState } from 'react';
import { AddModal } from './AddModal';

enum ModalType {
  PARTICIPANT = 'PARTICIPANT',
  SETTING = 'SETTING',
  ADD = 'ADD',
}

const getModalContent = (
  modalType: ModalType,
  closeModal: () => void,
  setModalType: any,
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
        />
      );
    case ModalType.SETTING:
      return (
        <SettingModal
          closeModal={closeModal}
          modalStateFunctions={modalStateFunctions}
        />
      );
    case ModalType.ADD:
      return (
        <AddModal
          closeModal={closeModal}
          modalStateFunctions={modalStateFunctions}
        />
      );
  }
};

export const ModalLayout = ({
  isOpen,
  closeModal,
  width,
  height,
}: {
  isOpen: boolean;
  width: string;
  height: string;
  closeModal: () => void;
}) => {
  const modalOpen = isOpen ? '' : 'hidden';
  const [modalType, setModalType] = useState(ModalType.PARTICIPANT);
  const modalCloseAndSetParticipant = () => {
    closeModal();
    setModalType(ModalType.PARTICIPANT);
  };
  const modalContent = getModalContent(
    modalType,
    modalCloseAndSetParticipant,
    setModalType,
  );
  return (
    <>
      <div
        className={`fixed inset-0 z-[10] ${modalOpen} bg-[#f3f0f8] opacity-50`}
        onClick={modalCloseAndSetParticipant}
      ></div>
      <div
        style={{ width: width, height: height }}
        className={`fixed top-1/2 left-1/2 ${modalOpen} rounded-[5px] transform -translate-x-1/2 \
            -translate-y-1/2 bg-default z-[20]`}
      >
        {modalContent}
      </div>
    </>
  );
};
