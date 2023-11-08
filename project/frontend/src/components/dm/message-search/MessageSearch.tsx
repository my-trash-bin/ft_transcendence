import { MessageSearchInput } from './MessageSearchInput';

export function MessageSearch() {
  return (
    <div className="w-[350px] mb-[20px] pt-[30px] ">
      <h3 className="mb-[30px] text-[32px] pl-[30px]">메세지</h3>
      <MessageSearchInput width="270px" height="30px" />
    </div>
  );
}
