import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function withDmAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    const router = useRouter();

    useEffect(() => {
      const validateAndCheckParticipation = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));

          const canSend: any = await api.dmControllerCanSendDm(
            props.params.username,
          );

          if (!canSend.data) {
            throw { error: { type: 'block' } };
          }
        } catch (e: any) {
          if (e?.error?.type === 'block') {
            router.replace('/dm'); // window.location.href = '/dm';
          }

          if (e?.error?.statusCode === 401 || e?.error?.statusCode == 403)
            router.replace('/'); // window.location.href = '/';
        }
      };

      validateAndCheckParticipation();
    }, [api, props.channelId, props.params.username, router]);

    return <Component {...props} />;
  };
}
