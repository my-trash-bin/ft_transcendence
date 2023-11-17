import Image from 'next/image';
export function MessageSendBox() {
  return (
    <div className="w-[95%] h-[60px] border-t border-default flex justify-center items-center">
      <div className="h-[30px] w-[85%] flex flex-row justify-center relative bg-chat-color2 rounded-[10px]">
        <input
          type="text"
          placeholder="Enter your message"
          className="bg-chat-color2 outline-none h-[100%] w-[90%] pr-[1%] placeholder:text-center"
        />
        <button className="w-[5%] h-[100%] self-end">
          <Image
            alt="send icon"
            src="/icon/message-send.svg"
            width={30}
            height={30}
            layout="relative"
          />
        </button>
      </div>
    </div>
  );
}
