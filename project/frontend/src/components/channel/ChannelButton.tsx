export const ChannelButton = ({
  onClick,
  text,
  width,
  height,
  classStyle,
  disable = false,
}: {
  onClick: any;
  text: string;
  width: string;
  height: string;
  classStyle?: string;
  args?: any;
  disable?: boolean;
}) => {
  const disableStyle =
    'opacity-30 bg-purple-500 rounded-sm border text-white cursor-not-allowed';
  const enableStyle = `bg-purple-500 rounded-sm border text-white hover:bg-purple-300 ${classStyle}`;

  return (
    <button
      disabled={disable}
      style={{ width: width, height: height }}
      className={disable ? disableStyle : enableStyle}
      onClick={onClick}
      type="button"
    >
      {text}
    </button>
  );
};
