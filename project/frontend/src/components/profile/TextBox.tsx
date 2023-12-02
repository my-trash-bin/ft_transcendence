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
  const textSize = isModal ? 'text-xl' : 'text-h3 leading-[2]';
  const gapSize = isModal ? 'gap-sm' : 'gap.md';
  return (
    <div className={`${gapSize} flex flex-col font-mayo leading-loose`}>
      <p className={`${textSize} text-dark-purple`}>
        닉네임: {nickname}
        <br />
        전적 : {win}승 {lose}패 {ratio}%
      </p>
      <p className={`${textSize} text-dark-gray`}>
        상태메세지 <br />
        {statusMessage === '' ? 'no status message' : statusMessage}
      </p>
    </div>
  );
};
