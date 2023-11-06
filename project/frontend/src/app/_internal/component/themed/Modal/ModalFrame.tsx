import { PropsWithChildren, ReactNode } from 'react';
import { ScrollContainer } from '../../base/Overlay/ScrollContainer';

export interface ModalFrameProps extends PropsWithChildren {
  title: string;
  width: number;
  onClose: () => void;
}

export function ModalFrame({
  title,
  width = 640,
  onClose,
  children,
}: ModalFrameProps): ReactNode {
  return (
    <ScrollContainer className="fixed top-0 left-0 w-screen h-screen pointer-events-auto bg-[#000000C8]">
      <div className="min-h-[100vh] px-xl flex flex-col justify-center items-center">
        <div
          className="my-[100px] bg-background rounded-lg p-xl w-full"
          style={{ width }}
        >
          <div className="flex justify-between">
            <div className="text-h2 translate-y-[2px]">{title}</div>
            <button onClick={onClose}>x</button>
          </div>
          {children}
        </div>
      </div>
    </ScrollContainer>
  );
}
