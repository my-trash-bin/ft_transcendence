import { ChannelType } from './CreateChannelModal';

export const ChannelSelector = ({
  channelType,
  channelTypeChangeEvent,
}: {
  channelType: ChannelType;
  channelTypeChangeEvent: (arg: ChannelType) => void;
}) => {
  const onChannelTypeChange = (e: any) => {
    switch (e.target.value) {
      case 'public':
        channelTypeChangeEvent(ChannelType.PUBLIC);
        break;
      case 'private':
        channelTypeChangeEvent(ChannelType.PRIVATE);
        break;
      case 'protected':
        channelTypeChangeEvent(ChannelType.PROTECTED);
        break;
    }
  };

  return (
    <div className="flex flex-row mb-[25px]">
      <input
        type="radio"
        name="channel type"
        value="public"
        className="ml-[20px]"
        checked={channelType === ChannelType.PUBLIC}
        onChange={onChannelTypeChange}
      />
      <label htmlFor="public" className="ml-[10px]">
        public
      </label>
      <input
        type="radio"
        name="channel type"
        value="private"
        className="ml-[20px]"
        checked={channelType === ChannelType.PRIVATE}
        onChange={onChannelTypeChange}
      />
      <label htmlFor="private" className="ml-[10px]">
        private
      </label>
      <input
        type="radio"
        name="channel type"
        value="protected"
        className="ml-[20px]"
        checked={channelType === ChannelType.PROTECTED}
        onChange={onChannelTypeChange}
      />
      <label htmlFor="protected" className="ml-[10px]">
        protected
      </label>
    </div>
  );
};
