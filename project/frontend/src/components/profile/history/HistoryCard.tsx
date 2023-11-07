import Image from 'next/image';

interface HistoryCardProps {
  readonly user1Name: string;
  readonly user2Name: string;
  readonly user1Avatar: string;
  readonly user2Avatar: string;
  readonly user1Score: number;
  readonly user2Score: number;
}

export function HistoryCard(props: HistoryCardProps) {
  const bgCSS = 'bg-default-interactive rounded-md';
  const size = 'py-sm px-sm my-sm w-full h-sm';
  const borderCSS = 'border-dark-purple-interactive border-3';
  const textCSS = 'text-dark-gray-interactive font-bold text-h2';
  const alignCSS = 'flex items-center justify-items-stretch';
  const hoverCSS =
    'cursor-pointer transition-all duration-300 ease-in-out hover:shadow-custom hover:-translate-y-[0.148rem]';
  return (
    <li
      className={`${textCSS} ${alignCSS} ${borderCSS} ${hoverCSS} ${size} ${bgCSS} relative`}
    >
      <Image
        src={props.user1Avatar}
        alt="avatar"
        width={50}
        height={50}
        className="absolute left-sm"
      />
      <span className="text-left absolute left-2xl">{props.user1Name}</span>
      <span className="absolute left-1/2 transform -translate-x-1/2 text-center">
        {props.user1Score}:{props.user2Score}
      </span>
      <span className="text-right absolute right-2xl">{props.user2Name}</span>

      <Image
        src={props.user2Avatar}
        alt="avatar"
        width={50}
        height={50}
        className="absolute right-sm"
      />
    </li>
  );
}
