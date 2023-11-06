import Link from 'next/link';

interface LinkButtonProps {
  text: string;
  href: string;
}

function LinkButton(props: LinkButtonProps) {
  return (
    <Link
      href={props.href}
      className="w-xl h-lg flex flex-col justify-center items-center
         rounded-lg border-2 mb-xl bg-chat-color1"
    >
      {props.text}
    </Link>
  );
}

export default LinkButton;
