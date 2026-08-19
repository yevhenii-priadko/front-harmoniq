'use client';

import { ReactNode, Suspense, useState } from 'react';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import css from './ProfileTabs.module.css';

type ProfileTabsProps = {
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

type TabKey = 'myArticles' | 'savedArticles';

function ProfileTabsContent({
  myArticles,
  savedArticles,
}: ProfileTabsProps) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const [activeTab, setActiveTab] = useState<TabKey>(
    searchParams.get('tab') === 'savedArticles' ? 'savedArticles' : 'myArticles',
  );

  const handleTabChange = (tab: TabKey) => {
    if (tab === activeTab) {
      return;
    }

    setActiveTab(tab);

    const params = new URLSearchParams(searchParams.toString());

    if (tab === 'savedArticles') {
      params.set('tab', 'savedArticles');
    } else {
      params.delete('tab');
    }

    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  };

  return (
    <div className={css.tabsContainer}>
      <div className={css.tabs}>
        <button
          type='button'
          onClick={() => handleTabChange('myArticles')}
          className={activeTab === 'myArticles' ? css.active : ''}
        >
          My Articles
        </button>

        <button
          type='button'
          onClick={() => handleTabChange('savedArticles')}
          className={activeTab === 'savedArticles' ? css.active : ''}
        >
          Saved Articles
        </button>
      </div>

      {activeTab === 'myArticles' ? myArticles : savedArticles}
    </div>
  );
}

export default function ProfileTabs(props: ProfileTabsProps) {
  return (
    <Suspense fallback={null}>
      <ProfileTabsContent {...props} />
    </Suspense>
  );
}
