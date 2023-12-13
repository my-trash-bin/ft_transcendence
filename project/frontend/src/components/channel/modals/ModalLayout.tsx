'use client';
import { PropsWithChildren } from 'react';

type ModalLayoutProps = {
  isOpen: boolean;
  width: string;
  height: string;
  closeModal: () => void;
  zValue?: number;
  outFocus?: boolean;
};

export const ModalLayout = ({
  isOpen,
  closeModal,
  width,
  height,
  children,
  zValue,
  outFocus = false,
}: PropsWithChildren<ModalLayoutProps>) => {
  const myZ = zValue ?? 20;
  const outZ = myZ - 5;
  const modalData = isOpen ? (
    <>
      <div
        style={{ zIndex: outZ }}
        className={`fixed inset-0 bg-[#f3f0f8] opacity-50 ${
          outFocus ? 'pointer-events-none' : ''
        }`}
        onClick={(e) => {
          // console.log('hi');
          e.stopPropagation();
          e.preventDefault();
          if (!outFocus) {
            // console.log('bye');
            closeModal();
          }
        }}
      />
      <div
        style={{
          width: width,
          height: height,
          zIndex: myZ,
        }}
        className="fixed top-1/2 left-1/2 rounded-[5px] border-3 border-dark-purple transform -translate-x-1/2 -translate-y-1/2 bg-default"
      >
        {children}
      </div>
    </>
  ) : null;

  return <>{modalData}</>;
};
