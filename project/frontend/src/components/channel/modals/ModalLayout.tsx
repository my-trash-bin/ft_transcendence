'use client';
import { PropsWithChildren } from 'react';

type ModalLayoutProps = {
  isOpen: boolean;
  width: string;
  height: string;
  closeModal: () => void;
  zValue?: number;
};

export const ModalLayout = ({
  isOpen,
  closeModal,
  width,
  height,
  children,
  zValue,
}: PropsWithChildren<ModalLayoutProps>) => {
  const setZ = zValue ?? 20;

  const modalData = isOpen ? (
    <>
      <div
        className="fixed inset-0 z-10 bg-[#f3f0f8] opacity-50"
        onClick={closeModal}
      />
      <div
        style={{
          width: width,
          height: height,
          zIndex: setZ,
        }}
        className="fixed top-1/2 left-1/2 rounded-[5px] border-3 border-dark-purple transform -translate-x-1/2 -translate-y-1/2 bg-default"
      >
        {children}
      </div>
    </>
  ) : null;

  return <>{modalData}</>;
};
