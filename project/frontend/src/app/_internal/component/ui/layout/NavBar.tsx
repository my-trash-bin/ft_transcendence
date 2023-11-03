import Image from 'next/image';
import { Anchor } from '../../themed/Anchor/Anchor';
import { Logo } from './Logo';

const className =
  'm-sm basis-xs p-md text-left border border-primary rounded-md flex text-text hover:text-link focus:text-link active:text-link';

export function NavBar() {
  return (
    <nav
      className="flex flex-col h-full bg-background justify-center"
      style={{ width: 200 }}
    >
      <div className="flex flex-col items-center mt-sm mb-xl">
        <Logo />
        <Anchor href="/friend" className={className}>
          <Image
            src="/icon/friend.svg"
            alt="friend-icon"
            width={50}
            height={50}
          />
          <h3 className="mb-md">friend</h3>
        </Anchor>
        <Anchor href="/dm" className={className}>
          <h3 className="mb-md">dm</h3>
        </Anchor>
        <Anchor href="/channel" className={className}>
          <h3 className="mb-md">channel</h3>
        </Anchor>
        <Anchor href="/game" className={className}>
          <h3 className="mb-md">game</h3>
        </Anchor>
        <Anchor href="/profile" className={className}>
          <h3 className="mb-md">profile</h3>
        </Anchor>
      </div>
    </nav>
  );
}
