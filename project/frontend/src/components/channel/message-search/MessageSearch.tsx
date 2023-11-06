import { MessageSearchInput } from './MessageSearchInput';

export function MessageSearch() {
  return (
    <div className="w-[100%] h-[25%] pt-[5%] pl-[5%]">
      <h3 className="w-[45%] h-[35%] ml-[8%] mb-[5%] text-[1.8rem]">메세지</h3>
      <MessageSearchInput />
    </div>
  );
}
