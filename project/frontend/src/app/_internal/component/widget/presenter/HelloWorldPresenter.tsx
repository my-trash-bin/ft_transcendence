import { HelloWorld } from '@/types.generated';

export interface HelloWorldPresenterProps {
  data: HelloWorld;
}

export function HelloWorldPresenter({ data }: HelloWorldPresenterProps) {
  return <div>{data.message}</div>;
}
