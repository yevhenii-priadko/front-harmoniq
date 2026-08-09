import Link from 'next/link';
import css from './Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <Link href="/" className={css.logo}>
        harmoniq
      </Link>

      <p className={css.copyright}>
        © {year} Harmoniq. All rights reserved.
      </p>

      <nav className={css.links}>
  <ul className={css.linksList}>
    <li><Link href="/articles">Articles</Link></li>
    <li><Link href="/profile">Account</Link></li>
  </ul>
</nav>
    </footer>
  );
}

export default Footer;