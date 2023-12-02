import { Api } from '@/api/api';
import { useQueries } from 'react-query';

export function useProfileAndChannelInfo(channelId: string) {
  const meApi = () => new Api().api.usersControllerMyProfile();
  const channelApi = () =>
    new Api().api.channelControllerFindChannelInfo(channelId);

  const results = useQueries([
    {
      queryKey: 'me',
      queryFn: meApi,
    },
    {
      queryKey: ['channelMembers', channelId],
      queryFn: channelApi,
    },
  ]);

  const isLoading = results.some((result) => result.isLoading);
  const isError = results.some((result) => result.isError);

  if (isLoading) {
    return { isLoading: true };
  }
  if (isError) {
    throw new Error('Error fetching data');
  }

  return { me: results[0].data?.data, channel: results[1].data.data };
}
