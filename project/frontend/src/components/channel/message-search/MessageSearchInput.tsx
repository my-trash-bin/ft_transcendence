import Image from 'next/image';

export function MessageSearchInput() {
  return (
    <div
      className={`relative w-[80%] h-[25%] border border-dark-gray rounded-[10px]`}
    >
      <button className="absolute left-[4%] top-[50%] translate-y-[-50%] w-[20px] h-[25px] border-none">
        <Image
          src="/icon/search.svg"
          alt="search icon"
          width={30}
          height={30}
          layout="relative"
        />
      </button>
      <input
        type="text"
        placeholder="search user"
        className="absolute w-[70%] h-[90%] top-[50%] left-[15%] translate-y-[-47%] border-none bg-none outline-none placeholder:text-left pl-[1%]"
      ></input>
      <button className="absolute left-[88%] top-[50%] translate-y-[-50%] w-[20px] h-[25px] border-none">
        <Image
          src="/icon/cross-circle.svg"
          alt="cross icon"
          width={30}
          height={30}
          layout="relative"
        />
      </button>
    </div>
  );
}
