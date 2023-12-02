interface TextBoxProps {
  readonly nickname: string;
  readonly win: number;
  readonly lose: number;
  readonly ratio: number;
  readonly statusMessage: string;
  readonly isModal?: boolean;
}

export const TextBox: React.FC<TextBoxProps> = ({
  nickname,
  win,
  lose,
  ratio,
  statusMessage,
  isModal = false,
}) => {
  const paddingClass = isModal ? 'pl-lg' : 'pl-2xl';
  const textClass = `font-semibold font-mayo text-dark-purple leading-loose' + ${
    isModal ? 'text-xl' : 'text-h3'
  }`;
  const lightClass = 'font-normal text-dark-gray leading-[4]';
  return (
    <div className={paddingClass}>
      <p className={textClass}>
        닉네임: {nickname}
        <br />
        전적 : {win}승 {lose}패 {ratio}%
        <br />
      </p>

      <p className={lightClass}>{statusMessage}</p>
    </div>
  );
};
