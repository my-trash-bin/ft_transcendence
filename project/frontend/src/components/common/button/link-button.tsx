import Link from 'next/link';
import styles from './link-button.module.css';

interface LinkButtonProps {
  text: string;
  href: string;
}
function LinkButton(props: LinkButtonProps) {
  return (
    <Link href={props.href} className={styles.button}>
      {props.text}
    </Link>
  );
}

export default LinkButton;
