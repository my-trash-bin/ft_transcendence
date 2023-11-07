import Image from 'next/image';

export function MessageSearchInput({ margin }: Readonly<{ margin: string }>) {
  return (
    <div>
      <div
        className={`w-[75%] h-[35px] ${margin} border border-dark-gray rounded-[10px] flex flex-row items-center justify-between`}
      >
        <Image
          className="w-[20px] h-[25px] ml-sm"
          src="/icon/search.svg"
          alt="search icon"
          width={30}
          height={30}
        />
        <input
          type="text"
          placeholder="search user"
          className="w-[80%] h-xs border-gray outline-none placeholder-text-left pl-[1%] "
        />
        <Image
          src="/icon/cross-circle.svg"
          alt="cross icon"
          width={30}
          height={30}
          className="border-none w-[20px] h-[25px] mr-sm"
        />
      </div>
    </div>
  );
}
