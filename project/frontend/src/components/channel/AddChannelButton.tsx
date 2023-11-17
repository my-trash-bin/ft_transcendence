import Image from 'next/image';
import { useState } from 'react';
import { CreateChannelModal } from './modals/CreateChannelModal';

export function AddChannelButton() {
  const [isOpen, setIsOpen] = useState(false);
  const closeModal = () => {
    setIsOpen(false);
  };
  const openModal = () => {
    setIsOpen(true);
  };
  return (
    <>
      <CreateChannelModal isOpen={isOpen} closeModal={closeModal} />
      <button onClick={openModal}>
        <Image
          alt="add channel"
          src="/icon/add.svg"
          width={25}
          height={25}
          layout="relative"
        />
      </button>
    </>
  );
}
