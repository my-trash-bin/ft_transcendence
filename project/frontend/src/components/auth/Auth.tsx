import { Api } from '@/api/api';
import { useEffect, useState } from 'react';
const validatedUrl = ['/'];

export default function withAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const [validAuth, setValidAuth] = useState(true);
    // if (!validAuth) window.location.href = '/';
    useEffect(() => {
      const validate = async () => {
        try {
          const res = await new Api().api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));
        } catch (e: any) {
          if (e.error.statusCode === 401) {
            // window.location.href = '/';
            // setValidAuth(false);
          } else if (e.error.statusCode === 403) {
            console.log('error!! = ', e);
            // setValidAuth(false);
          }
        }
      };
      validate();
    }, []);
    return <Component {...props} />;
  };
}
