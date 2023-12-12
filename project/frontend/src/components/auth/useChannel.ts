import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useQueries } from 'react-query';

export const useChannel = (channelId: string) => {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const profileApi = api.usersControllerMyProfile;
  const channelApi = api.channelControllerIsParticipated;
  const data = useQueries([
    { queryKey: 'profile', queryFn: profileApi },
    { queryKey: 'channel', queryFn: () => channelApi(channelId), cacheTime: 0 },
  ]);
  const isLoading = data.some((d) => d.isLoading);
  useEffect(() => {
    if (!isLoading) {
      const me = data[0].data;
      const channel = data[1].data;

      if (me?.data.phase === 'register') router.replace('/sign-in');
      else if (me?.data.phase === 'complete')
        localStorage.setItem('me', JSON.stringify(me.data.me));
      else if (me?.data.phase === '2fa') router.replace('/2fa');
      if (!channel?.data) {
        router.replace('/channel');
      }
    }
  }, [isLoading, router, data, channelId]);

  return {
    isLoading: isLoading,
  };
};
