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
  const textClass = isModal ? 'pl-lg' : 'pl-2xl';
  const boldClass = isModal
    ? 'font-semibold text-xl text-dark-purple leading-loose'
    : 'font-semibold text-h3 text-dark-purple leading-loose';
  const lightClass = 'font-normal text-dark-gray leading-[4]';
  return (
    <div className={textClass}>
      <p className={boldClass}>
        닉네임: {nickname}
        <br />
        전적 : {win}승 {lose}패 {ratio}%
        <br />
      </p>
      <p className={lightClass}>{statusMessage}</p>
    </div>
  );
};
