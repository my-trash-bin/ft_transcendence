import { Title } from '@/components/common/Title';
import { MessageSearchInput } from './MessageSearchInput';

export function MessageSearch({
  userSearchCallback,
}: {
  userSearchCallback: (arg: string) => void;
}) {
  return (
    <div className="w-[350px] mb-[20px] pt-lg pl-sm flex flex-col gap-md">
      <Title font="big">메세지</Title>
      <MessageSearchInput
        width="330px"
        height="30px"
        placeholder="유저 검색"
        eventFunction={userSearchCallback}
      />
    </div>
  );
}
