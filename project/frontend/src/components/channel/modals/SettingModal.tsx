import Image from 'next/image';

export function SettingModal({
  closeModal,
  modalStateFunctions,
}: {
  closeModal: () => void;
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
}) {
  return (
    <>
      <div className="flex flex-row justify-between pt-[10px] pl-[10px] pr-[10px]">
        <button onClick={modalStateFunctions.setModalParticipant}>
          <Image
            alt="return"
            src="/icon/return.svg"
            width={20}
            height={20}
          ></Image>
        </button>
        <button onClick={closeModal}>
          <Image
            alt="close modal"
            src="/icon/cross-small.svg"
            width={25}
            height={25}
          ></Image>
        </button>
      </div>
      <div className="h-[400px] flex flex-col justify-center items-center">
        <p className="mb-[15px]">비밀번호 설정</p>
        <input
          type="password"
          placeholder="비밀번호를 입력하세요."
          className="pl-[10px] rounded-sm outline-none placeholder:text-[12px] placeholder:text-center"
        ></input>
        <p className="text-[12px] mt-[5px]">
          비밀번호는 숫자 6자리로 입력해 주세요.
        </p>
        <div className="mt-[30px] pl-[20px] pr-[20px] w-[200px] flex flex-row justify-between">
          <button className="bg-purple-500 w-[60px] rounded-sm border text-white hover:bg-purple-300">
            적용
          </button>
          <button
            className="bg-purple-500 w-[60px] rounded-sm border text-white hover:bg-purple-300"
            onClick={closeModal}
          >
            취소
          </button>
        </div>
      </div>
    </>
  );
}
