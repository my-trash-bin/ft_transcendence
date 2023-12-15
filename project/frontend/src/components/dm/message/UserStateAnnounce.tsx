export enum UserState {
  LEAVE = 'leave',
  JOIN = 'join',
}

export function UserStateAnnounce({
  userState,
  nickname,
}: Readonly<{ userState: any; nickname: string }>) {
  return (
    <>
      {userState === UserState.LEAVE ? (
        <p
          className="w-[460px] h-[25px] bg-light-background rounded-md
         text-dark-gray self-center text-center text-[15px] mb-[10px]"
        >
          {nickname} 님이 나갔습니다.
        </p>
      ) : (
        <p
          className="w-[460px] h-[25px] bg-light-background rounded-md
          text-dark-gray self-center text-center text-[15px] mb-[10px]"
        >
          {nickname} 님이 들어왔습니다.
        </p>
      )}
    </>
  );
}
