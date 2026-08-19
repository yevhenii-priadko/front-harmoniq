import Image from 'next/image';
import Link from 'next/link';
import type { Author } from '@/lib/api/clientApi';
import { getAvatarSrc } from '@/lib/profile/userProfile';
import css from './AuthorsItem.module.css';

type AuthorsItemProps = {
  author: Author;
  priority?: boolean;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'A';

export default function AuthorsItem({ author, priority = false }: AuthorsItemProps) {
  const name = author.username || author.email || 'Author';
  const avatarSrc = getAvatarSrc(author.avatar);

  return (
    <li className={css.item}>
      <Link
        className={css.card}
        href={`/authors/${author._id}`}
        aria-label={`Open ${name} profile`}
      >
        <div className={css.avatarBox}>
          {avatarSrc ? (
            <Image
              className={css.avatar}
              src={avatarSrc}
              alt={name}
              width={148}
              height={148}
              priority={priority}
            />
          ) : (
            <div className={css.avatarFallback} aria-hidden="true">
              {getInitial(name)}
            </div>
          )}
        </div>
        <p className={css.name}>{name}</p>
      </Link>
    </li>
  );
}
