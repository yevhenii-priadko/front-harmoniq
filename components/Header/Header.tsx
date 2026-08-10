"use client";

import { useState } from "react";
import Link from "next/link";

import Container from "../Container/Container";
import Logo from "../Logo/Logo";

import styles from "./Header.module.css";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  const closeMenu = () => {
    setIsOpen(false);
  };

  return (
    <header className={styles.header}>
      <Container>
        <div className={styles.inner}>
          <Logo />

          <nav
            className={styles.desktopNav}
            aria-label="Main navigation"
          >
            <Link href="/" className={styles.link}>
              Home
            </Link>

            <Link href="/articles" className={styles.link}>
              Articles
            </Link>

            <Link href="/authors" className={styles.link}>
              Creators
            </Link>

            <Link href="/login" className={styles.link}>
              Log in
            </Link>

            <Link href="/register" className={styles.join}>
              Join now
            </Link>
          </nav>

          <div className={styles.mobileActions}>
            <Link href="/register" className={styles.tabletJoin}>
              Join now
            </Link>

            <button
              type="button"
              className={styles.burger}
              aria-label="Open navigation menu"
              aria-expanded={isOpen}
              onClick={() => setIsOpen((prev) => !prev)}
            >
              <span />
              <span />
              <span />
            </button>
          </div>
        </div>

        {isOpen && (
          <nav
            className={styles.mobileMenu}
            aria-label="Mobile navigation"
          >
            <Link
              href="/"
              className={styles.mobileLink}
              onClick={closeMenu}
            >
              Home
            </Link>

            <Link
              href="/articles"
              className={styles.mobileLink}
              onClick={closeMenu}
            >
              Articles
            </Link>

            <Link
              href="/authors"
              className={styles.mobileLink}
              onClick={closeMenu}
            >
              Creators
            </Link>

            <Link
              href="/login"
              className={styles.mobileLink}
              onClick={closeMenu}
            >
              Log in
            </Link>

            <Link
              href="/register"
              className={styles.mobileJoin}
              onClick={closeMenu}
            >
              Join now
            </Link>
          </nav>
        )}
      </Container>
    </header>
  );
}