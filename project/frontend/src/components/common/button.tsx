interface ButtonProps {
  readonly onClick: () => void;
  readonly text: string;
}

function Button(props: ButtonProps) {
  return (
    <button
      className="bg-chat-color1-interactive text-white w-md h-xs text-lg"
      onClick={props.onClick}
    >
      {props.text}
    </button>
  );
}

export default Button;
