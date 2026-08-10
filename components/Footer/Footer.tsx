import Link from 'next/link';
import css from './Footer.module.css';

function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className={css.footer}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          harmoniq
        </Link>

        <p className={css.copyright}>© {year} Harmoniq. All rights reserved.</p>

        <nav aria-label="Footer navigation">
          <ul className={css.linksList}>
            <li>
              <Link href="/articles" className={css.link}>
                Articles
              </Link>
            </li>
            <li>
              <Link href="/profile" className={css.link}>
                Account
              </Link>
            </li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}

export default Footer;