import Image from 'next/image';
export function ModalButtons({
  modalStateFunctions,
}: {
  modalStateFunctions: {
    setModalParticipant: () => void;
    setModalSetting: () => void;
    setModalAdd: () => void;
  };
}) {
  return (
    <div className="flex flex-row justify-between mt-[15px] pr-[30px] pl-[30px]">
      <div>
        <button className="mr-[15px]" onClick={modalStateFunctions.setModalAdd}>
          <Image
            alt="user add button"
            src="/icon/user-add.svg"
            width={20}
            height={20}
          ></Image>
        </button>
        <button onClick={modalStateFunctions.setModalSetting}>
          <Image
            alt="channel setting button"
            src="/icon/setting.svg"
            width={20}
            height={20}
          ></Image>
        </button>
      </div>
      <div>
        <button>
          <Image
            alt="exit button"
            src="/icon/exit.svg"
            width={20}
            height={20}
          ></Image>
        </button>
      </div>
    </div>
  );
}
