interface ButtonProps {
  readonly onClick: () => void;
  readonly children: React.ReactNode;
}

function Button(props: ButtonProps) {
  return (
    <button
      className="bg-chat-color1 text-white w-md h-xs text-lg"
      onClick={props.onClick}
    >
      {props.children} {/* Render children prop */}
    </button>
  );
}

export default Button;
