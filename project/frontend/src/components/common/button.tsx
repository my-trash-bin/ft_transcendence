interface ButtonProps {
  onClick: () => void;
  children: React.ReactNode;
}

function Button(props: ButtonProps) {
  return (
    <button
      className="bg-chat-color1 text-white w-md h-sm text-h1"
      onClick={props.onClick}
    >
      {props.children} {/* Render children prop */}
    </button>
  );
}

export default Button;
