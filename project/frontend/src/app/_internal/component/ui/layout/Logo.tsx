import Image from 'next/image';

export function Logo() {
  return (
    <div
      className="m-md flex flex-col items-center border border-primary rounded-md"
      style={{ width: 100, height: 100 }}
    >
      <h1 className="mb-sm">our pong</h1>
      <Image src="/images/totoro.png" alt="totoro" width={50} height={50} />
    </div>
  );
}
