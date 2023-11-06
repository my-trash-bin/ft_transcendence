import styles from './MessageContent.module.css';
import { MyChat } from './MyChat';
import { OtherChat } from './OtherChat';

export function MessageContent() {
  return (
    <div className={`${styles['message-content']}`}>
      <MyChat
        content="hasdasdsaasdasdasdassdfljsdaf"
        time={new Date()}
        isFirst={true}
      />
      <MyChat
        content="hasdasdsaasdasdasdassdfljsdaf"
        time={new Date()}
        isFirst={false}
      />
      <MyChat
        content="hasdasdsaasdasdasdassdfljsdaf"
        time={new Date()}
        isFirst={false}
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
