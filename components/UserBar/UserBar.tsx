"use client";

import Image from "next/image";
import css from "./UserBar.module.css";
import { useState } from "react";

interface User {
    username?: string;
    avatar?: string;
}

interface UserBarProps {
    user: User;
}

export default function UserBar({ user }: UserBarProps) {
    const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

    const handleOpenModal = () => setIsLogoutModalOpen(true);
    const handleCloseModal = () => setIsLogoutModalOpen(false);
    return (
        <div className={css.container}>
            <div className={css.userBox}>
                <div className={css.avatarWrapper}>
                    {user?.avatar ? (
                        <Image
                            src={user.avatar}
                            alt="user avatar"
                            width={40}
                            height={40}
                            priority
                            className={css.avatar}
                        />
                    ) : (
                        <svg className={css.avatarFallback} width={40} height={40}>
                            <use href="/sprite.svg#icon-user" />
                        </svg>
                    )}
                </div>
                <p className={css.name}>{user.username || "User"}</p>
            </div>

            <div className={css.divider} />

            <button
                type="button"
                className={css.logoutBtn}
                onClick={handleOpenModal}
                aria-label="Log out"
            >
                <svg className={css.logoutIcon} width={24} height={24}>
                    <use href="/sprite.svg#icon-log-out" />
                </svg>
            </button>
            {/* {isLogoutModalOpen && (
                <LogoutModal onClose={handleCloseModal} />
            )} */}
        </div>
    );
}
