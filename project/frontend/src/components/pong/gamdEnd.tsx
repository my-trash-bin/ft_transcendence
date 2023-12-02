import React, { useEffect } from 'react';
import { useRouter } from 'next/navigation'; // 'next/router'를 사용합니다.

const GameEnd = () => {
  const router = useRouter();

  useEffect(() => {
    const timer = setTimeout(() => {
      router.push('/game');
    }, 5000);

    return () => clearTimeout(timer);
  }, [router]);

  const containerCSS = 'flex flex-col items-center justify-center h-[100%] w-[100%]';
  const resultBoxCSS = 'bg-default-interactive p-8 rounded-lg shadow-lg w-[500px] h-[300px] flex flex-col items-center justify-center';
  const titleCSS = 'text-2xl font-bold mb-4';
  const textCSS = 'text-dark-purple-interactive text-sm';

  return (
    <div className={containerCSS}>
      <div className={resultBoxCSS}>
        <h1 className={titleCSS}>게임 결과</h1>
        <p className={textCSS}>[게임 결과 내용]</p> {
          /* 최근 전적에 관한 data를 받아와서 보여줌 */
        }
      </div>
      <p className={textCSS}>잠시 후 게임 페이지로 돌아갑니다...</p>
    </div>
  );
};

export default GameEnd;
