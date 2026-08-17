import { ReactNode } from 'react';
import ProfileTabs from '@/components/ProfileTabs/ProfileTabs';
import css from './ProfileLayout.module.css';

type ProfileLayoutProps = {
  children: ReactNode;
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

export default function ProfileLayout({
  children,
  myArticles,
  savedArticles,
}: ProfileLayoutProps) {
  return (
    <section className={css.profileSection}>
      {children}

      <ProfileTabs
        myArticles={myArticles}
        savedArticles={savedArticles}
      />
    </section>
  );
}