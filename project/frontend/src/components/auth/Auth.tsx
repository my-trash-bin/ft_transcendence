import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';

export default function withAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          if (res.data.phase === 'register') window.location.href = '/sign-in';
          else if (res.data.phase === 'complete')
            window.location.href = '/friend';
          else if (res.data.phase === '2fa') window.location.href = '/2fa';
          localStorage.setItem('me', JSON.stringify(res.data.me));
        } catch (e: any) {
          if (e?.error?.statusCode === 401 || e?.error?.statusCode === 403) {
            window.location.href = '/';
          }
          console.log('error!! = ', e);
        }
      };
      validate();
    }, [api]);
    return <Component {...props} />;
  };
}
