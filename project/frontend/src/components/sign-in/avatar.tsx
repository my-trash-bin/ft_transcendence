import Image from 'next/image';
import styles from './avatar.module.css';

type AvatarProps = {
  name: string;
  isSelected: boolean;
};

export default function Avatar({ name, isSelected }: AvatarProps) {
  const src = `/avatar/${name}`;

  const avatarClassname = isSelected ? styles.active_card : styles.card;

  return (
    <Image
      src={src}
      priority={true}
      alt="avatar"
      width={100}
      height={100}
      className={avatarClassname}
    />
  );
}
