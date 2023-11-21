import { PropsWithChildren } from 'react';

interface LinkButtonProps extends PropsWithChildren {
  readonly onClick?: () => void;
}

function LinkButton({ onClick, children }: LinkButtonProps) {
  return (
    <button
      onClick={onClick}
      className="w-xl h-lg flex flex-col justify-center items-center rounded-lg border-2 mb-xl bg-chat-color1"
    >
      {children}
    </button>
  );
}

export default LinkButton;
