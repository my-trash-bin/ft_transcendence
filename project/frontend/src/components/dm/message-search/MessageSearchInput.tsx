'use client';

import Image from 'next/image';
import { useEffect, useState } from 'react';

export function MessageSearchInput({
  height,
  width,
  placeholder,
  eventFunction,
}: Readonly<{
  height: string;
  width: string;
  placeholder: string;
  eventFunction: (searchInput: string) => any | void;
}>) {
  const [searchInput, setSearchInput] = useState('');
  const [callApi, setCallApi] = useState(false);

  const inputChangeEvent = (event: any) => {
    setSearchInput(event.target.value);
    setCallApi(true);
  };

  useEffect(() => {
    const identifier = setTimeout(() => {
      if (callApi) {
        eventFunction(searchInput);
        setCallApi(false);
      }
    }, 500);

    return () => {
      clearTimeout(identifier);
    };
  }, [eventFunction, searchInput, callApi]);

  const crossOnClick = (event: any) => {
    setSearchInput('');
    setCallApi(true);
  };

  return (
    <div>
      <div
        style={{ height: height, width: width }}
        className={`border border-gray rounded-[10px] flex flex-row items-center justify-between`}
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
          value={searchInput}
          onChange={inputChangeEvent}
          placeholder={placeholder}
          className="w-[80%] h-[90%] bg-[inherit] outline-none placeholder-text-left pl-[10px] placeholder:italic"
        />
        <button onClick={crossOnClick}>
          <Image
            src="/icon/cross-circle.svg"
            alt="cross icon"
            width={30}
            height={30}
            className="border-none w-[20px] h-[25px] mr-sm"
          />
        </button>
      </div>
    </div>
  );
}
