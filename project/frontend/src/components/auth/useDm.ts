import { ApiContext } from '@/app/_internal/provider/ApiContext';
import { useRouter } from 'next/navigation';
import { useContext, useEffect } from 'react';
import { useQueries } from 'react-query';

export const useDm = (username: string) => {
  const { api } = useContext(ApiContext);
  const router = useRouter();
  const profileApi = api.usersControllerMyProfile;
  const dmApi = api.dmControllerCanSendDm;
  const data = useQueries([
    { queryKey: 'profile', queryFn: profileApi },
    { queryKey: 'dm', queryFn: () => dmApi(username), cacheTime: 0 },
  ]);
  const isLoading = data.some((d) => d.isLoading);
  useEffect(() => {
    if (!isLoading) {
      const me = data[0].data;
      const dm = data[1].data;

      if (me?.data.phase === 'register') router.replace('/sign-in');
      else if (me?.data.phase === 'complete')
        localStorage.setItem('me', JSON.stringify(me.data.me));
      else if (me?.data.phase === '2fa') router.replace('/2fa');
      if (!dm?.data) {
        router.replace('/dm');
      }
    }
  }, [isLoading, router, data, username]);

  return {
    isLoading: isLoading,
  };
};
