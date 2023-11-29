import Image from 'next/image';
import { ModalLayout } from './ModalLayout';

export function EnterPasswordModal({
  isModalOpen,
  setIsModalOpen,
  targetChannelId,
}: Readonly<{
  isModalOpen: boolean;
  setIsModalOpen: (isOpen: boolean) => void;
  targetChannelId: string;
}>) {
  const closeModal = () => {
    setIsModalOpen(false);
  };

  return (
    <ModalLayout
      isOpen={isModalOpen}
      closeModal={closeModal}
      width="300px"
      height="230px"
    >
      <div className="flex flex-col h-[230px] items-center">
        <button onClick={closeModal} className="self-end">
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          ></Image>
        </button>
        <p className="mb-[15px] mt-[20px]">비밀번호 입력</p>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          className="pl-[10px] rounded-sm outline-none placeholder:text-[12px] placeholder:text-center"
        ></input>
        <button className="mt-[30px] pl-[20px] pr-[20px] w-[200px] h-[35px] bg-dark-purple rounded-md text-white">
          확인
        </button>
      </div>
    </ModalLayout>
  );
}
