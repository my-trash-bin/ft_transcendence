import { Api } from '@/api/api';
import { useEffect } from 'react';
const validatedUrl = ['/'];

export default function withAuth(Component: any) {
  return function WrappedComponent(props: any) {
    useEffect(() => {
      const validate = async () => {
        const res = await new Api().api.usersControllerMyProfile();
        localStorage.setItem('me', JSON.stringify(res.data.me));
        if (typeof window !== 'undefined') {
          // window.location.href = '/';
        }
      };
      validate();
    }, []);
    return <Component {...props} />;
  };
}
