import { useChannel } from './useChannel';

export default function withChannelAuth(Component: any) {
  return function WrappedComponent(props: any) {
    const { isLoading } = useChannel(props.params.channelId);

    if (isLoading) return <div>Loading...</div>; // 로딩 중 표시

    return <Component {...props} />;
  };
}
