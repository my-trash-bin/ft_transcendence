'use client';

export const ModalLayout = ({
  isOpen,
  closeModal,
}: {
  isOpen: boolean;
  closeModal: () => void;
}) => {
  const modalOpen = isOpen ? '' : 'hidden';
  return (
    <>
      <div
        className={`fixed inset-0 z-[10] ${modalOpen} bg-[#E7E1F3] opacity-50`}
        onClick={closeModal}
      ></div>
      <div className={`fixed inset-0 z-[10] ${modalOpen}`} onClick={closeModal}>
        <div
          className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[300px] h-[500px] bg-white z-[20]`}
          onClick={(e) => e.stopPropagation()}
        ></div>
      </div>
    </>
  );
};
