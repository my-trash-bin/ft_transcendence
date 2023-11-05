interface FriendCardProps {
  nickname: string;
  avatar_src: string;
}
function FriendCard(props: FriendCardProps) {
  return (
    <div className="w-[600px] h-[100px] bg-light-background flex items-center relative">
      <div className="w-md h-md bg-dark-purple rounded-full relative left-md"></div>
      <div className="text-left text-black text-h3 font-bold ml-xl">
        {props.nickname}
      </div>
      <div className="absolute right-xl flex">
        <div className="w-md h-xs bg-default border-2 border-dark-purple text-center text-black text-lg font-bold">
          게임 하기
        </div>
        <div className="w-md h-xs bg-default border-2 border-dark-purple text-center text-black text-lg font-bold">
          메세지
        </div>
      </div>
    </div>
  );
}
export default FriendCard;
