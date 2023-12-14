import Image from 'next/image';
import { useState } from 'react';
import Portal from '../common/Portal';
import { CreateChannelModal } from './modals/CreateChannelModal';

export function AddChannelButton() {
  const [isOpen, setIsOpen] = useState(false);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showFailToast, setShowFailToast] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  const css =
    'fixed w-[300px] h-[100px] left-1/2 p-sm transform -translate-x-1/2 translate-y-1/2 flex justify-center items-center bg-default border-3 border-dark-purple text-dark-purple rounded-md z-50 text-h3';
  return (
    <>
      {showSuccessToast && <div className={css}>채널 생성에 성공했습니다.</div>}
      {showFailToast && <div className={css}>채널 생성에 실패했습니다.</div>}
      <Portal selector={'#backdrop-root'}>
        <CreateChannelModal
          isOpen={isOpen}
          closeModal={closeModal}
          setShowSuccessToast={setShowSuccessToast}
          setShowFailToast={setShowFailToast}
        />
      </Portal>
      <button onClick={openModal}>
        <Image alt="add channel" src="/icon/add.svg" width={25} height={25} />
      </button>
    </>
  );
}
