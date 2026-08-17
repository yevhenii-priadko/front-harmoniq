'use client';

import { ReactNode, useState } from 'react';
import css from './ProfileTabs.module.css';

type ProfileTabsProps = {
  myArticles: ReactNode;
  savedArticles: ReactNode;
};

export default function ProfileTabs({
  myArticles,
  savedArticles,
}: ProfileTabsProps) {
  const [activeTab, setActiveTab] = useState<'myArticles' | 'savedArticles'>(
    'myArticles',
  );

  return (
    <div className={css.tabsContainer}>
      <div className={css.tabs}>
        <button
          type='button'
          onClick={() => setActiveTab('myArticles')}
          className={activeTab === 'myArticles' ? css.active : ''}
        >
          My Articles
        </button>

        <button
          type='button'
          onClick={() => setActiveTab('savedArticles')}
          className={activeTab === 'savedArticles' ? css.active : ''}
        >
          Saved Articles
        </button>
      </div>

      {activeTab === 'myArticles' ? myArticles : savedArticles}
    </div>
  );
}