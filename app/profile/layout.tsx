import { ReactNode } from 'react';
import ProfileTabs from '@/components/ProfileTabs/ProfileTabs';

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
    <>
      {children}

      <ProfileTabs
        myArticles={myArticles}
        savedArticles={savedArticles}
      />
    </>
  );
}