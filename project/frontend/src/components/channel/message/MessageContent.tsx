import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export function MessageContent() {
  return (
    <div className="w-[100%] h-[70%] pt-[5%] bg-light-background flex flex-col overflow-y-scroll">
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
