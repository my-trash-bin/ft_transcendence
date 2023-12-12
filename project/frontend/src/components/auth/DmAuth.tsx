import { useDm } from './useDm';

export default function withDmAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { isLoading } = useDm(props.params.username);

    if (isLoading) return <div>Loading...</div>; // 로딩 중 표시
    return <Component {...props} />;
  };
}
