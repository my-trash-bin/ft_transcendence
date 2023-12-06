import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useContext, useEffect } from 'react';

export default function withChannelAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { api } = useContext(ApiContext);

    useEffect(() => {
      const validateAndCheckParticipation = async () => {
        try {
          const res = await api.usersControllerMyProfile();
          localStorage.setItem('me', JSON.stringify(res.data.me));

          const participationRes: any =
            await api.channelControllerIsParticipated(props.channelId);
          if (!participationRes.data.data) {
            throw { error: { type: 'participant' } };
          }
        } catch (e: any) {
          if (e?.error?.type === 'participant')
            window.location.href = '/channel';

          if (e?.error?.statusCode === 401) window.location.href = '/';
        }
      };

      validateAndCheckParticipation();
    }, [api, props.channelId]);

    return <Component {...props} />;
  };
}
