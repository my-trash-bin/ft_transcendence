import Image from 'next/image';

interface BadgeProps {
  readonly imageURL: string;
  readonly name: string;
  readonly explanation: string;
}
export function Badge(props: BadgeProps) {
  const nameClass = 'font-semibold text-center text-xl pt-md pb-md';
  const commentClass = 'font-normal text-center text-md align-top pb-md';
  return (
    <div className="flex flex-col items-center">
      <div className="w-[100px] h-[100px] bg-white flex items-center justify-center">
        <Image
          src={props.imageURL}
          priority={true}
          alt="badge"
          width={100}
          height={100}
        />
      </div>
      <div className={nameClass}>{props.name}</div>
      <div className={commentClass}>{props.explanation}</div>
    </div>
  );
}
