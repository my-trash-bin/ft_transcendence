interface TextBoxProps {
  readonly nickname: string;
  readonly win: number;
  readonly lose: number;
  readonly ratio: number;
  readonly statusMessage: string;
}

export function TextBox(props: TextBoxProps) {
  const textClass = 'pl-2xl ';
  const boldClass = 'font-semibold text-h3 text-dark-purple leading-loose';
  const lightClass = 'font-normal text-dark-gray leading-[4]';
  return (
    <div className={textClass}>
      <p className={boldClass}>
        닉네임: {props.nickname}
        <br />
        전적 : {props.win}승 {props.lose}패 {props.ratio}%
        <br />
      </p>
      <p className={lightClass}>{props.statusMessage}</p>
    </div>
  );
}
