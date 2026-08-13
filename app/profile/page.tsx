'use client';

import Image from 'next/image';
import { useAuthStore } from '@/lib/store/authStore';
import { useProfileStore } from '@/lib/store/profileStore';

export default function ProfilePage() {
  const user = useAuthStore((state) => state.user);
  const totalArticles = useProfileStore((state) => state.totalArticles);

  if (!user) {
    return null;
  }

  const hasValidAvatar =
  !!user.avatar &&
  (user.avatar.startsWith('https://') ||
    user.avatar.startsWith('http://') ||
    user.avatar.startsWith('/'));

  return (
    <div>
      <h1>My Profile</h1>

      <div>
        {hasValidAvatar ? (
          <Image
            src={user.avatar!}
            alt={`${user.username} avatar`}
            width={100}
            height={100}
          />
        ) : (
          <div aria-label="User avatar unavailable" />
        )}

        <div>
          <p>{user.username}</p>
          <p>
            {totalArticles} {totalArticles === 1 ? 'article' : 'articles'}
          </p>
        </div>
      </div>
    </div>
  );
}
