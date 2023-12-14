interface TextBoxProps {
  readonly nickname: string;
  readonly win?: number;
  readonly lose?: number;
  readonly ratio?: number;
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
  const roundedRatio = ratio?.toFixed(1);

  function statusMessageShort(statusMessage: string) {
    if (statusMessage.length > 40) {
      return statusMessage.slice(0, 40) + '...';
    } else {
      return statusMessage;
    }
  }

  return (
    <div className={`${gapSize} flex flex-col font-mayo leading-loose`}>
      <p className={`${textSize} text-dark-purple`}>
        닉네임: {nickname}
        <br />
        전적 : {win}승 {lose}패 {roundedRatio}%
      </p>
      <p className="font-jeonju">jeonju</p>
      <p className="font-taebaek">taebaek</p>
      <p className="font-jeonju">jeonju</p>
      <p className="font-danjo">danjo</p>
      <p className="font-mayo">mayo</p>
      <p className="font-agro">agro</p>
      <p className={`text-md text-dark-gray`}>
        상태메세지 <br />
        {statusMessage === ''
          ? 'no status message'
          : statusMessageShort(statusMessage)}
      </p>
    </div>
  );
};
