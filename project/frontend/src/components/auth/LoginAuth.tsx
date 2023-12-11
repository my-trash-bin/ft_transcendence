import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';

export default function loginAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));
          location.href = '/profile';
        } catch (e: any) {
          //error시 / 그대로 유지
        }
      };
      validate();
    }, [api]);
    return <Component {...props} />;
  };
}
