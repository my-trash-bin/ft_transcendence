import useAuthRedirect, { PageType } from './useAuthRedirect';

const withAuth = (Component: React.ComponentType, pageType: PageType = '') => {
  return function WrappedComponent(props: any) {
    const { isLoading } = useAuthRedirect(pageType);

    if (isLoading) {
      return <div>Loading...</div>; // 로딩 중 표시
    }

    return <Component {...props} />;
  };
};

export default withAuth;
