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
      <p className="font-mayo">This is mayo 이것이 마요다 - 버튼용</p>
      <p className="font-agro">This is agro 이것이 어그로다 - 닉네임용</p>
      <p className="font-sejong">This is sejong 이것이 세종이다 - 텍스트용</p>
      <p className={lightClass}>{statusMessage}</p>
    </div>
  );
};
