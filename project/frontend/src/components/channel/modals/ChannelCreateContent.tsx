import { useEffect, useState } from 'react';
import { ChannelType } from './CreateChannelModal';
import { inputValidator } from './InputValidator';

export const ChannelCreateContent = ({
  channelType,
  setIsValid,
  inputTitle,
  inputPassword,
  inputSize,
  setInputTitle,
  setInputPassword,
  setInputSize,
}: {
  channelType: ChannelType;
  setIsValid: (arg: boolean) => void;
  inputTitle: string;
  inputPassword: string;
  inputSize: number;
  setInputTitle: (arg: string) => void;
  setInputPassword: (arg: string) => void;
  setInputSize: (arg: number) => void;
}) => {
  const [titleValid, setTitleValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(
    channelType !== ChannelType.PROTECTED,
  );
  const [sizeValid, setSizeValid] = useState(true);

  useEffect(() => {
    setPasswordValid(channelType !== ChannelType.PROTECTED);
    setTitleValid(false);
    setInputTitle('');
    setInputPassword('');
    setInputSize(2);
    setSizeValid(true);
    setIsValid(false);
  }, [channelType, setIsValid, setInputTitle, setInputPassword, setInputSize]);

  const validText = 'text-[12px] mt-[5px] text-dark-gray';
  const invalidText = 'text-[12px] mt-[5px] text-red-400';

  return (
    <>
      <div className="flex flex-col ml-[20px] mb-[15px]">
        <input
          className="disabled w-[200px] pl-[5px] h-[25px] focus:border-purple-500 focus:ring-purple-500 focus:ring-2 rounded-sm focus:outline-none"
          onChange={(e) => {
            let res = inputValidator('title', e.target.value);
            setTitleValid(res);
            if (res && passwordValid && sizeValid) setIsValid(true);
            else setIsValid(false);
            setInputTitle(e.target.value);
          }}
          value={inputTitle}
        />
        <p className={titleValid ? validText : invalidText}>
          6 ~ 20자 이내로 입력해 주세요. (특수문자 제외)
        </p>
      </div>
      <div className="flex flex-col ml-[20px] mb-[15px]">
        <input
          autoComplete="off"
          className="w-[200px] h-[25px] pl-[5px] rounded-sm focus:outline-none focus:border-purple-500 focus:ring-purple-500 focus:ring-2 disabled:bg-slate-300"
          type="password"
          disabled={channelType !== ChannelType.PROTECTED}
          onChange={(e) => {
            let res = inputValidator('password', e.target.value);
            setPasswordValid(res);
            if (res && titleValid && sizeValid) setIsValid(true);
            else setIsValid(false);
            setInputPassword(e.target.value);
          }}
          value={inputPassword}
        />
        <p className={passwordValid ? validText : invalidText}>
          비밀번호는 숫자 6자리로 입력해 주세요.
        </p>
      </div>
      <div className="flex flex-col ml-[20px]">
        <input
          className="w-[150px] h-[25px] pl-[5px] rounded-sm focus:outline-none focus:border-purple-500 focus:ring-purple-500 focus:ring-2"
          type="number"
          min={2}
          max={10}
          value={inputSize}
          onChange={(e) => {
            let res = inputValidator('size', e.target.value);
            setSizeValid(res);
            if (res && titleValid && passwordValid) setIsValid(true);
            else setIsValid(false);
            setInputSize(parseInt(e.target.value));
          }}
        />
        <p className={sizeValid ? validText : invalidText}>
          2 ~ 10명 사이로 입력해주세요.
        </p>
      </div>
    </>
  );
};
