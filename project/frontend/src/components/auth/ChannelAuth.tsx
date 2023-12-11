import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';

export default function withChannelAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    const router = useRouter();

    useEffect(() => {
      const validateAndCheckParticipation = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          if (res.data.phase === 'register') window.location.href = '/sign-in';
          else if (res.data.phase === 'complete')
            window.location.href = '/friend';
          else if (res.data.phase === '2fa') window.location.href = '/2fa';
          localStorage.setItem('me', JSON.stringify(res.data.me));

          const participationRes: any =
            await api.channelControllerIsParticipated(props.params.channelId);
          if (!participationRes.data) {
            throw { error: { type: 'participant' } };
          }
        } catch (e: any) {
          if (e?.error?.type === 'participant') {
            router.replace('/channel'); // window.location.href = '/channel';
          }

          if (e?.error?.statusCode === 401 || e?.error?.statusCode == 403)
            router.replace('/'); // window.location.href = '/';
        }
      };
      if (router) {
        validateAndCheckParticipation();
      }
    }, [api, router, props.channelId, props.params.channelId]);

    return <Component {...props} />;
  };
}
