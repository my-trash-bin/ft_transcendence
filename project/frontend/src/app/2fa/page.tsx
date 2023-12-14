'use client';
import { ApiContext } from '@/app/_internal/provider/ApiContext';
import withAuth from '@/components/auth/withAuth';
import { Button } from '@/components/common/Button';
import { useRouter } from 'next/navigation';
import { useCallback, useContext, useState } from 'react';

function TwofactorPage() {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const [password, setPassword] = useState('');
  function handlePassword(e: React.ChangeEvent<HTMLInputElement>) {
    setPassword(e.target.value);
  }
  const handleSubmitClick = useCallback(async () => {
    if (!password) {
      alert('비밀번호가 입력되지 않았습니다.');
      return;
    }
    try {
      const result = await api.authControllerTwoFactorAuthentication({
        password,
      });
      if (!result.ok) {
        console.error({ result });
      } else {
        router.push('/friend');
      }
    } catch (error: any) {
      if (error.status === 422) {
        alert('비밀번호 오류입니다. 다시 입력하세요.');
      } else if (error.status === 401) {
        alert('JWT가 올바르지 않습니다.');
      } else if (error.status === 403) {
        alert('JWT Phase가 올바르지 않습니다.');
      }
      console.error('Error 2fa login:', error);
    }
  }, [api, password, router]);

  return (
    <div className="min-h-screen flex items-center justify-center font-jeonju">
      <div className="w-2xl h-[400px] bg-light-background rounded-lg flex flex-col justify-center items-center">
        <h2 className="font-bold mb-xl">2차 인증 비밀번호를 입력하세요.</h2>
        {render()}
      </div>
    </div>
  );
  function render() {
    return (
      <div className="flex flex-col">
        <input
          type="password"
          placeholder="인증 비밀번호를 입력하세요."
          value={password}
          onChange={handlePassword}
          className="ml-md mr-md border-2 border-gray p-[2px]"
        />
        <div className="self-end mt-xl">
          <Button onClick={handleSubmitClick} disabled={!password}>
            다음으로
          </Button>
        </div>
      </div>
    );
  }
}

export default withAuth(TwofactorPage, '2fa');
