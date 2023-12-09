import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function withChannelAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);
    const router = useRouter();

    useEffect(() => {
      const validateAndCheckParticipation = async () => {
        try {
          const res = await api.usersControllerMyProfile();
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
