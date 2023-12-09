import { ChannelType } from './CreateChannelModal';

export const ChannelSelector = ({
  channelType,
  channelTypeChangeEvent,
  isRow,
}: {
  channelType: ChannelType;
  channelTypeChangeEvent: (arg: ChannelType) => void;
  isRow: boolean;
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

  const flex = isRow ? 'flex-row' : 'flex-col';
  return (
    <div className={`flex ${flex} mb-[25px]`}>
      <div>
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
      </div>
      <div>
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
      </div>
      <div>
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
    </div>
  );
};
