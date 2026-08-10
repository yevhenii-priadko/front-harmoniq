import Image from "next/image";
import Link from "next/link";
import styles from "./Logo.module.css";

export default function Logo() {
  return (
    <Link href="/" className={styles.logo} aria-label="Harmoniq home">
      <Image
        src="/logo.png"
        alt="Harmoniq"
        width={165}
        height={46}
        priority
        className={styles.logoImage}
      />
    </Link>
  );
}