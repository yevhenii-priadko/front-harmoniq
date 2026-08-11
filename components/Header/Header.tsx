'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import UserBar from '../UserBar/UserBar';
import { useAuthStore } from '@/lib/store/authStore';
import css from './Header.module.css';

type NavItem = {
  href: string;
  label: string;
};

const GUEST_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/authors', label: 'Creators' },
];

const AUTH_NAV: NavItem[] = [
  { href: '/', label: 'Home' },
  { href: '/articles', label: 'Articles' },
  { href: '/authors', label: 'Creators' },
  { href: '/profile', label: 'My Profile' },
];

function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const pathname = usePathname();

  const user = useAuthStore((state) => state.user);
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);

  // Закриваємо бургер-меню при переході на іншу сторінку.
  // Патерн "adjusting state during render" замість useEffect — так React
  // не робить зайвий каскадний ре-рендер (див. react.dev/learn/you-might-not-need-an-effect).
  const [prevPathname, setPrevPathname] = useState(pathname);
  if (pathname !== prevPathname) {
    setPrevPathname(pathname);
    setIsMenuOpen(false);
  }

  // На сторінках логіну та реєстрації Header містить лише логотип
  const isAuthPage = pathname === '/login' || pathname === '/register';

  const navItems = isAuthenticated ? AUTH_NAV : GUEST_NAV;
  const actionHref = isAuthenticated ? '/articles/new' : '/register';
  const actionLabel = isAuthenticated ? 'Create an article' : 'Join now';

  const toggleMenu = () => setIsMenuOpen((current) => !current);

  return (
    <header className={css.header}>
      <div className={css.container}>
        <Link href="/" className={css.logo}>
          harmoniq
        </Link>

        {!isAuthPage && (
          <div className={css.actions}>
            {/* Десктопна навігація — видна лише від 1440px */}
            <nav className={css.nav} aria-label="Main navigation">
              <ul className={css.navList}>
                {navItems.map(({ href, label }) => (
                  <li key={href}>
                    <Link
                      href={href}
                      className={css.navLink}
                      aria-current={pathname === href ? 'page' : undefined}
                    >
                      {label}
                    </Link>
                  </li>
                ))}

                {/* ТЗ описує "Log in" як посилання, стилізоване під кнопку,
                    але на самому макеті Figma це звичайне текстове посилання
                    (без pill-фону) — варто звірити з ментором, який варіант вірний. */}
                {!isAuthenticated && (
                  <li>
                    <Link href="/login" className={css.navLink}>
                      Log in
                    </Link>
                  </li>
                )}
              </ul>
            </nav>

            {/* Кнопка дії — видна на Tablet і Desktop, на Mobile схована (переїжджає в меню) */}
            <Link href={actionHref} className={css.actionButton}>
              {actionLabel}
            </Link>

            {/* UserBar — лише Desktop, лише авторизований, закрите меню */}
            {isAuthenticated && user && (
              <UserBar user={{ username: user.username, avatar: user.avatar ?? undefined }} />
            )}

            {/* Бургер-кнопка — схована на Desktop */}
            <button
              type="button"
              className={css.burgerButton}
              aria-label={isMenuOpen ? 'Close menu' : 'Open menu'}
              aria-expanded={isMenuOpen}
              onClick={toggleMenu}
            >
              <svg className={css.burgerIcon} aria-hidden="true">
                <use href={`/sprite.svg#${isMenuOpen ? 'icon-close-small' : 'icon-burger'}`} />
              </svg>
            </button>
          </div>
        )}
      </div>

      {!isAuthPage && isMenuOpen && (
        <div className={css.mobileMenu}>
          <ul className={css.mobileNavList}>
            {navItems.map(({ href, label }) => (
              <li key={href}>
                <Link href={href} className={css.navLink}>
                  {label}
                </Link>
              </li>
            ))}
            {!isAuthenticated && (
              <li>
                <Link href="/login" className={css.navLink}>
                  Log in
                </Link>
              </li>
            )}
          </ul>

          {/* Дублікат кнопки дії — видно лише на Mobile всередині відкритого меню,
              на Tablet ця кнопка вже показана в рядку хедера (див. .actionButton) */}
          <Link href={actionHref} className={css.actionButtonMobile}>
            {actionLabel}
          </Link>
        </div>
      )}
    </header>
  );
}

export default Header;