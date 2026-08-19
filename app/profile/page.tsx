'use client';

import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfileStore } from '@/lib/store/profileStore';
import { getAvatarSrc } from '@/lib/profile/userProfile';
import css from './ProfileLayout.module.css';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const totalArticles = useProfileStore((state) => state.totalArticles);

  if (!user) {
    return null;
  }

  const avatarSrc = getAvatarSrc(user.avatar);

  return (
  <div className={css.profile}>
    <h1 className={css.title}>My Profile</h1>

    <div className={css.userInfo}>
      {avatarSrc ? (
        <Image
          className={css.avatar}
          src={avatarSrc}
          alt={`${user.username} avatar`}
          width={100}
          height={100}
        />
      ) : (
        <div
          className={css.avatarPlaceholder}
          aria-label="User avatar unavailable"
        />
      )}

      <div className={css.userDetails}>
        <p className={css.username}>{user.username}</p>

        <p className={css.articleCount}>
          {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
        </p>
      </div>
    </div>
  </div>
);
}
