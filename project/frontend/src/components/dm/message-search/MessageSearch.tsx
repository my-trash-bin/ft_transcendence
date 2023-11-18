import { MessageSearchInput } from './MessageSearchInput';

export function MessageSearch({
  userSearchCallback,
}: {
  userSearchCallback: (arg: string) => void;
}) {
  return (
    <div className="w-[350px] mb-[20px] pt-lg pl-sm">
      <h3 className="text-h2 font-semibold text-dark-gray pb-md">메세지</h3>
      <MessageSearchInput
        width="330px"
        height="30px"
        placeholder="유저 검색"
        eventFunction={userSearchCallback}
      />
    </div>
  );
}
