import { Api } from '@/api/api';
import { useEffect } from 'react';

export default function withAuth(Component: any) {
  return function WrappedComponent(props: any) {
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await new Api().api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));
        } catch (e: any) {
          if (e?.error?.statusCode === 401 || e?.error?.statusCode === 403) {
            window.location.href = '/';
          }
          console.log('error!! = ', e);
        }
      };
      validate();
    }, []);
    return <Component {...props} />;
  };
}
