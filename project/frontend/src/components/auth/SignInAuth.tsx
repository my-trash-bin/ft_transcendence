import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';

export default function signInAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          console.log(res.data);
          if (res.data.phase === '2fa') location.href = '/2fa';
          else if (res.data.phase === 'complete') location.href = '/friend';
          localStorage.setItem('me', JSON.stringify(res.data.me));
        } catch (e: any) {
          location.href = '/';
        }
      };
      validate();
    }, [api]);
    return <Component {...props} />;
  };
}

// 'register' -> auth만 된 상태
// '2fa' ->
