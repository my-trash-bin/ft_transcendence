import Link from 'next/link';

interface ProfileButtonProps {
  href: string;
  text: string;
}

export function ProfileButton(props: ProfileButtonProps) {
  const buttonClass =
    'w-lg h-sm bg-default rounded-sm border-2 border-dark-purple ' +
    'text-center text-black text-lg font-bold hover:bg-light-background  ' +
    'flex items-center justify-center ' +
    'absolute top-xl right-xl';
  return (
    <Link href={props.href} className={buttonClass}>
      {props.text}
    </Link>
  );
}
