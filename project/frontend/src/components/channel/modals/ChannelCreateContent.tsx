import { useEffect, useState } from 'react';
import { ChannelType } from './CreateChannelModal';

export const ChannelCreateContent = ({
  channelType,
  isValid,
  setIsValid,
}: {
  channelType: ChannelType;
  isValid: boolean;
  setIsValid: (arg: boolean) => void;
}) => {
  const [titleValid, setTitleValid] = useState(false);
  const [passwordValid, setPasswordValid] = useState(
    channelType === ChannelType.PUBLIC,
  );
  const [sizeValid, setSizeValid] = useState(true);
  const [inputTitle, setInputTitle] = useState('');
  const [inputPassword, setInputPassword] = useState('');
  const [inputSize, setInputSize] = useState(2);

  useEffect(() => {
    setPasswordValid(channelType === ChannelType.PUBLIC);
  }, [channelType]);

  const inputValidator = (identifier: string, value: string) => {
    const specialCharRegex = /[!@#$%^&*(),.?":{}|<>]/;

    switch (identifier) {
      case 'title':
        if (
          value.length > 15 ||
          value.length < 2 ||
          specialCharRegex.test(value)
        ) {
          setTitleValid(false);
          setIsValid(false);
        } else {
          setTitleValid(true);
          if (passwordValid && sizeValid) {
            setIsValid(true);
          }
        }
        break;
      case 'password':
        if (value.length !== 6 || !/^\d+$/.test(value)) {
          setPasswordValid(false);
          setIsValid(false);
        } else {
          setPasswordValid(true);
          if (titleValid && sizeValid) {
            setIsValid(true);
          }
        }
        break;
      case 'size':
        if (
          parseInt(value) < 2 ||
          parseInt(value) > 10 ||
          isNaN(parseInt(value))
        ) {
          setSizeValid(false);
          setIsValid(false);
        } else {
          setSizeValid(true);
          if (titleValid && passwordValid) {
            setIsValid(true);
          }
        }
        break;
    }
  };
  const validText = 'text-[12px] mt-[5px]';
  const invalidText = 'text-[12px] mt-[5px] text-red-400';
  console.log('titleValid = ' + titleValid);
  console.log('passwordValid = ' + passwordValid);
  console.log('sizeValid = ' + sizeValid);
  return (
    <>
      <div className="flex flex-col ml-[20px] mb-[15px]">
        <input
          className="disabled w-[200px] pl-[5px] h-[25px] focus:border-purple-500 focus:ring-purple-500 focus:ring-2 rounded-sm focus:outline-none"
          onChange={(e) => {
            inputValidator('title', e.target.value);
            setInputTitle(e.target.value);
          }}
          value={inputTitle}
        ></input>
        <p className={titleValid ? validText : invalidText}>
          2 ~ 15자 이내로 입력해 주세요. (특수문자 제외)
        </p>
      </div>
      <div className="flex flex-col ml-[20px] mb-[15px]">
        <input
          className="w-[200px] h-[25px] pl-[5px] rounded-sm focus:outline-none focus:border-purple-500 focus:ring-purple-500 focus:ring-2 disabled:bg-slate-300"
          type="password"
          disabled={channelType === ChannelType.PUBLIC}
          onChange={(e) => {
            inputValidator('password', e.target.value);
            setInputPassword(e.target.value);
          }}
          value={inputPassword}
        ></input>
        <p className={passwordValid ? validText : invalidText}>
          숫자 6자리로 입력해 주세요.
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
            inputValidator('size', e.target.value);
            setInputSize(parseInt(e.target.value));
          }}
        ></input>
        <p className={sizeValid ? validText : invalidText}>
          2 ~ 10명 사이로 입력해주세요.
        </p>
      </div>
    </>
  );
};
