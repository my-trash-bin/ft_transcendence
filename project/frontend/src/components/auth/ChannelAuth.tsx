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
          if (res.data.phase === 'register') {
            router.replace('/sign-in');
          } else if (res.data.phase === 'complete') {
            localStorage.setItem('me', JSON.stringify(res.data.me));
            router.replace('/friend');
          } else if (res.data.phase === '2fa') {
            router.replace('/2fa');
            console.log(`스토리지저장: ${res.data.me}`);
          }

          const participationRes: any =
            await api.channelControllerIsParticipated(props.params.channelId);
          if (!participationRes.data) {
            throw { error: { type: 'participant' } };
          }
        } catch (e: any) {
          if (e?.error?.type === 'participant') {
            router.replace('/channel'); // router.replace('/channel';
          }

          if (e?.error?.statusCode === 401 || e?.error?.statusCode == 403)
            router.replace('/'); // router.replace('/';
        }
      };
      if (router) {
        validateAndCheckParticipation();
      }
    }, [api, router, props.channelId, props.params.channelId]);

    return <Component {...props} />;
  };
}
