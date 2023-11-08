import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export function MessageContent() {
  return (
    <div className="w-[95%] h-[610px] pt-[20px] bg-chat-color2 rounded-[10px] flex flex-col overflow-y-scroll">
      <MyChat content="sdassdfljsdaf" time={new Date()} />
      <MyChat
        content="sdassdfljsdafsdassdfljsdafsdassdfljsdaf"
        time={new Date()}
      />
      <MyChat
        content="sdassdfljsdafsdassdfljsdafsdassdfljsdafsdassdfljsdaf"
        time={new Date()}
      />

      <OtherChat
        content="h"
        time={new Date()}
        profile="/avatar/avatar-black.svg"
        isFirst={true}
      />
      <OtherChat
        content="h"
        time={new Date()}
        profile="/avatar/avatar-black.svg"
        isFirst={false}
      />
      <OtherChat
        content="h"
        time={new Date()}
        profile="/avatar/avatar-black.svg"
        isFirst={false}
      />
    </div>
  );
}
