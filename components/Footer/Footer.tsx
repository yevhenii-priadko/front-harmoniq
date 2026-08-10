import Link from "next/link";

import Logo from "../Logo/Logo";

import styles from "./Footer.module.css";

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.inner}>
        <Logo />

        <p className={styles.copyright}>
          © 2025 Harmoniq. All rights reserved.
        </p>

        <nav className={styles.links} aria-label="Footer navigation">
          <Link href="/articles" className={styles.link}>
            Articles
          </Link>

          <Link href="/profile" className={styles.link}>
            Account
          </Link>
        </nav>
      </div>
    </footer>
  );
}