import { MessageContent } from '../dm/message/MessageContent';
import { MessageSendBox } from '../dm/message/MessageSendBox';
import { ChannelInfo } from './ChannelInfo';

export function ChannleMessageBox({ modalOpen }: { modalOpen: () => void }) {
  return (
    <>
      <ChannelInfo modalOpen={modalOpen} />
      <MessageContent />
      <MessageSendBox />
    </>
  );
}
