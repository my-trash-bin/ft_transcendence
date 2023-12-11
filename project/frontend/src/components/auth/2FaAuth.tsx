import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';

export default function faAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          console.log(res.data);
          if (res.data.phase === 'register') location.href = '/sign-in';
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
