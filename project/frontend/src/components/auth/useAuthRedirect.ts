import { ApiContext } from '@/app/_internal/provider/ApiContext'; // API 컨텍스트 (예시 경로)
import { useRouter } from 'next/navigation';
import { useContext } from 'react';
import { useQuery } from 'react-query';

enum RedirectPaths {
  Root = '/',
  Freind = '/friend',
  SignIn = '/sign-in',
  TwoFa = '/2fa',
}

export type PageType =
  | '2fa'
  | 'friend'
  | 'root'
  | 'dm'
  | 'chat'
  | 'signIn'
  | 'game'
  | 'profile'
  | 'history'
  | '';

export const LocalStorageMeKey = 'me';

const getRedirecPath = (page: PageType, phase: string) => {
  let redirectPath = '';
  switch (page) {
    case '2fa':
      if (phase === 'complete') redirectPath = RedirectPaths.Freind;
      break;
    case 'friend':
      // Friend 페이지에는 별도의 리디렉션이 필요하지 않음
      break;
    case 'root':
      if (phase === 'complete') redirectPath = RedirectPaths.Freind;
      break;
    case 'signIn':
      if (phase === 'complete') redirectPath = RedirectPaths.Freind;
      break;
    default:
      // 일반 페이지의 기본 리디렉션 로직
      if (phase === 'register') redirectPath = RedirectPaths.SignIn;
      else if (phase === '2fa') redirectPath = RedirectPaths.TwoFa;
      else if (phase !== 'complete') redirectPath = RedirectPaths.Root;
      break;
  }
  return redirectPath;
};

const useAuthRedirect = (pageType: PageType) => {
  const router = useRouter();
  const { api } = useContext(ApiContext);

  const { isLoading } = useQuery('auth', api.usersControllerMyProfile, {
    onSuccess: (data) => {
      const { id, phase, me } = data.data;
      // console.log(id, phase, me);
      if (phase === 'complete' && me !== undefined) {
        localStorage.setItem(LocalStorageMeKey, JSON.stringify(me));
      } else {
        localStorage.removeItem(LocalStorageMeKey);
      }
      const redirectPath = getRedirecPath(pageType, phase);
      if (redirectPath) {
        router.replace(redirectPath);
      }
    },
    onError: (_err) => {
      localStorage.removeItem(LocalStorageMeKey);
      api
        .authControllerLogout()
        .then(() => {})
        .catch((error) => {
          console.error('Logout error:', error);
        })
        .finally(() => {
          router.replace(RedirectPaths.Root);
        });
    },
    retry: false,
  });

  return { isLoading };
};

export default useAuthRedirect;
