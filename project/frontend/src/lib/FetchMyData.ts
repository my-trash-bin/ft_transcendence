import { Api } from '@/api/api';

export async function fetchMyData(setIsLoading?: (isLoading: boolean) => void) {
  const data = await new Api().api.usersControllerMyProfile();
  localStorage.setItem('me', JSON.stringify(data.data));
  if (setIsLoading) setIsLoading(false);
}
