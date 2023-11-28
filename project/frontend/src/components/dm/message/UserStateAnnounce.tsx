export enum UserState {
  LEAVE = 'LEAVE',
  JOIN = 'JOIN',
}

export function UserStateAnnounce({
  userState,
  nickname,
}: Readonly<{ userState: UserState; nickname: string }>) {
  return (
    <>
      {userState === UserState.LEAVE ? (
        <p
          className="w-[480px] h-[25px] bg-light-background rounded-md
         text-dark-gray self-center text-center text-[15px]"
        >
          {nickname} 님이 나가셨습니다
        </p>
      ) : (
        <p
          className="w-[480px] h-[25px] bg-light-background rounded-md
        text-white self-center text-center text-[15px]"
        >
          {nickname} 님이 들어오셨습니다
        </p>
      )}
    </>
  );
}
