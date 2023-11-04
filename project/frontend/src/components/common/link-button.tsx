import Link from 'next/link';

interface LinkButtonProps {
  text: string;
  href: string;
}

function LinkButton(props: LinkButtonProps) {
  return (
    <Link
      href={props.href}
      className="w-md h-sm flex flex-col justify-center items-center
         rounded-lg border-2 mb-2000 bg-chat-color1"
    >
      {props.text}
    </Link>
  );
}

export default LinkButton;
