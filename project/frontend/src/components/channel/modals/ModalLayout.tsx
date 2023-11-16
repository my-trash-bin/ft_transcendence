'use client';
import { PropsWithChildren } from 'react';

type ModalLayoutProps = {
  isOpen: boolean;
  width: string;
  height: string;
  closeModal: () => void;
};

export const ModalLayout = ({
  isOpen,
  closeModal,
  width,
  height,
  children,
}: PropsWithChildren<ModalLayoutProps>) => {
  const modalData = isOpen ? (
    <>
      <div
        className={`fixed inset-0 z-[10] bg-[#f3f0f8] opacity-50`}
        onClick={closeModal}
      ></div>
      <div
        style={{ width: width, height: height }}
        className={`fixed top-1/2 left-1/2 rounded-[5px] transform -translate-x-1/2 \
          -translate-y-1/2 bg-default z-[20]`}
      >
        {children}
      </div>
    </>
  ) : null;
  return <>{modalData}</>;
};
