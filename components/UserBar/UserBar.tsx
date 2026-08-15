"use client";

import Image from "next/image";
import css from "./UserBar.module.css";
import { useState } from "react";
import ErrorNotification from "@/components/ErrorNotification/ErrorNotification";
import LogoutModal from "@/components/LogoutModal/LogoutModal";

interface User {
  username?: string;
  avatar?: string;
}

interface UserBarProps {
  user: User;
}

// ⚠️ Бекенд іноді підставляє невалідний плейсхолдер "https:URL" замість
// реального аватара (наприклад, коли юзер реєструється без фото) —
// next/image впаде на такому значенні. Перевіряємо, що це реально
// схоже на робочий URL (Cloudinary), інакше показуємо fallback-іконку.
const getAvatarSrc = (avatar?: string) => {
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
  const [logoutError, setLogoutError] = useState("");
  const avatarSrc = getAvatarSrc(user?.avatar);

  const handleOpenModal = () => setIsLogoutModalOpen(true);
  const handleCloseModal = () => setIsLogoutModalOpen(false);

  return (
    <>
      <div className={css.container}>
        <div className={css.userBox}>
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
      </div>

      <ErrorNotification message={logoutError} onClose={() => setLogoutError("")} />

      {isLogoutModalOpen && (
        <LogoutModal onClose={handleCloseModal} onError={setLogoutError} />
      )}
    </>
  );
}
