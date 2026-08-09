'use client'

import css from './UserBar.module.css';

interface User {
    username?: string;
    email?: string;
    avatar?: string;
}

interface UserBarProps {
    user: User;
    onLogout: () => void;
}

export default function UserBar({ user, onLogout }: UserBarProps) {
    return (
        <button
            type="button"
            className={css.logoutBtn}
            onClick={onLogout}
            aria-label="Log out"
        >
            <svg className={css.logoutIcon}>
                <use href="/sprite.svg#icon-log-out" />
            </svg>
        </button>
    );
}