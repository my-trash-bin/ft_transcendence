import Image from 'next/image';

export function MessageSearchInput({
  height,
  width,
}: Readonly<{ height: string; width: string }>) {
  return (
    <div>
      <div
        style={{ height: height, width: width }}
        className={`border border-dark-gray rounded-[10px] flex flex-row items-center justify-between`}
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
          className="w-[80%] h-[90%] border-gray outline-none placeholder-text-left pl-[1%] "
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
