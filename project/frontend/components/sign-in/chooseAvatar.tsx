import Avatar from './avatar';

type ChooseAvatarProps = {
  avatars: string[];
  selectedAvatar: string | null;
  onAvatarSelect: (avatar: string) => void;
  onChooseClick: () => void;
};

export default function ChooseAvatar({
  avatars,
  selectedAvatar,
  onAvatarSelect,
  onChooseClick,
}: ChooseAvatarProps) {
  return (
    <div>
      <h2>Step 2: Choose an Avatar</h2>

      <div className="avatar-options">
        {avatars.map((avatar, index) => (
          <div
            key={index}
            className={`avatar-option ${
              selectedAvatar === avatar ? 'selected' : ''
            }`}
            onClick={() => onAvatarSelect(avatar)}
          >
            <Avatar name={avatar} isSelected={selectedAvatar === avatar} />
          </div>
        ))}
      </div>

      <button className="choose-button" onClick={onChooseClick}>
        Choose
      </button>
    </div>
  );
}
