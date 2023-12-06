import { Api } from '@/api/api';
import { useEffect } from 'react';

export default function loginAuth(Component: any) {
  return function WrappedComponent(props: any) {
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await new Api().api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));
          location.href = '/profile';
        } catch (e: any) {
          //error시 / 그대로 유지
        }
      };
      validate();
    }, []);
    return <Component {...props} />;
  };
}
