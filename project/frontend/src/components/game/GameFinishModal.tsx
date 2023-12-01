'use client';
import { ModalLayout } from '../channel/modals/ModalLayout';

interface ModalProfileProps {
  isOpen: boolean;
  onClose: () => void;
  readonly refetchPage?: () => Promise<unknown>;
}

export const GameFinishModal: React.FC<ModalProfileProps> = ({
  isOpen,
  onClose,
}) => {
  return (
    <ModalLayout
      isOpen={isOpen}
      closeModal={onClose}
      width="400px"
      height="500px"
    >
      <div className="p-xl flex flex-col">GameFinishModal</div>
    </ModalLayout>
  );
};
