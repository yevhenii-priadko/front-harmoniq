import { create } from 'zustand';

interface ProfileStore {
  totalArticles: number;
  setTotalArticles: (totalArticles: number) => void;
}

export const useProfileStore = create<ProfileStore>((set) => ({
  totalArticles: 0,

  setTotalArticles: (totalArticles) =>
    set({
      totalArticles,
    }),
}));