"use client";

import Image from "next/image";
import css from "./UserBar.module.css";
import { useState } from "react";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import LogoutModal from "@/components/LogoutModal/LogoutModal";
import UserModal from "@/components/UserModal/UserModal";
import type { AuthUser } from "@/lib/store/authStore";

interface UserBarProps {
  user: AuthUser;
}

// ⚠️ Бекенд іноді підставляє невалідний плейсхолдер "https:URL" замість
// реального аватара (наприклад, коли юзер реєструється без фото) —
// next/image впаде на такому значенні. Перевіряємо, що це реально
// схоже на робочий URL (Cloudinary), інакше показуємо fallback-іконку.
const getAvatarSrc = (avatar?: string | null) => {
  if (!avatar) return null;

  try {
    const url = new URL(avatar);
    return url.hostname === "res.cloudinary.com" ? avatar : null;
  } catch {
    return null;
  }
};

export default function UserBar({ user }: UserBarProps) {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isUserModalOpen, setIsUserModalOpen] = useState(false);
  const [logoutError, setLogoutError] = useState("");
  const avatarSrc = getAvatarSrc(user?.avatar);

  const handleOpenLogoutModal = () => setIsLogoutModalOpen(true);
  const handleCloseLogoutModal = () => setIsLogoutModalOpen(false);

  return (
    <>
      <div className={css.container}>
        <button
          type="button"
          className={css.userBox}
          aria-label="Edit profile"
          onClick={() => setIsUserModalOpen(true)}
        >
          <div className={css.avatarWrapper}>
            {avatarSrc ? (
              <Image
                src={avatarSrc}
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
          <span className={css.name}>{user.username || "User"}</span>
        </button>

        <div className={css.divider} />

        <button
          type="button"
          className={css.logoutBtn}
          onClick={handleOpenLogoutModal}
          aria-label="Log out"
        >
          <svg className={css.logoutIcon} width={24} height={24}>
            <use href="/sprite.svg#icon-log-out" />
          </svg>
        </button>
      </div>

      <ErrorNotification message={logoutError} onClose={() => setLogoutError("")} />

      {isLogoutModalOpen && (
        <LogoutModal onClose={handleCloseLogoutModal} onError={setLogoutError} />
      )}

      {isUserModalOpen && (
        <UserModal user={user} onClose={() => setIsUserModalOpen(false)} />
      )}
    </>
  );
}
