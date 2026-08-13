'use client';

import { useRef, useState } from 'react';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import Button from '@/components/Button/Button';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import {
    fetchAuthorArticlesClient,
    type Author,
    type Article,
    type ArticlesResponse,
} from '@/lib/api/clientApi';
import css from './AuthorProfile.module.css';
import Image from 'next/image';

const ARTICLES_PER_PAGE = 12;

type AuthorProfileProps = {
    author: Author;
    initialArticlesData: ArticlesResponse;
    initialError?: string;
};

const getAvatarSrc = (avatar?: string | null) => {
    const trimmedAvatar = avatar?.trim();

    if (!trimmedAvatar || trimmedAvatar === 'https:URL') {
        return null;
    }

    if (trimmedAvatar.startsWith('/')) {
        return trimmedAvatar;
    }

    try {
        const url = new URL(trimmedAvatar);
        return url.hostname === 'res.cloudinary.com' || url.hostname === 'ftp.goit.study'
            ? trimmedAvatar
            : null;
    } catch {
        return null;
    }
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'A';

export default function AuthorProfile({
    author,
    initialArticlesData,
    initialError = '',
}: AuthorProfileProps) {
    const [articles, setArticles] = useState<Article[]>(initialArticlesData.articles);
    const [page, setPage] = useState(initialArticlesData.page);
    const [totalPages, setTotalPages] = useState(initialArticlesData.totalPages);
    const [totalArticles, setTotalArticles] = useState(
        initialArticlesData.totalArticles || initialArticlesData.articles.length
    );
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(initialError);

    const name = author.username || author.email || 'Author';
    const avatarSrc = getAvatarSrc(author.avatar);

    const listRef = useRef<HTMLDivElement>(null);

    const loadMoreArticles = async () => {
        const nextPage = page + 1;
        setIsLoading(true);
        setError('');

        try {
            const data = await fetchAuthorArticlesClient(
                author._id,
                nextPage,
                ARTICLES_PER_PAGE
            );

            setArticles((prevArticles) => {
                const existingIds = new Set(prevArticles.map((a) => a._id));
                const newArticles = data.articles.filter((a) => !existingIds.has(a._id));

                return [...prevArticles, ...newArticles];
            });

            setPage(data.page);
            setTotalPages(data.totalPages);

            if (data.totalArticles !== undefined) {
                setTotalArticles(data.totalArticles);
            }

            listRef.current?.scrollIntoView({
                behavior: 'smooth',
                block: 'start',
            });
        } catch {
            setError('Unable to load articles. Please try again later.');
        } finally {
            setIsLoading(false);
        }
    };

    const hasArticles = articles.length > 0;
    const canLoadMore = page < totalPages;

    return (
        <div className={css.profileWrapper}>
            <ErrorNotification message={error} onClose={() => setError('')} />

            <div className={css.authorHeader}>
                <div className={css.avatarBox}>
                    {avatarSrc ? (
                        <Image
                            className={css.avatar}
                            src={avatarSrc}
                            alt={name}
                            width={120}
                            height={120}
                            priority
                        />
                    ) : (
                        <div className={css.avatarFallback} aria-hidden="true">
                            {getInitial(name)}
                        </div>
                    )}
                </div>
                <div className={css.authorInfo}>
                    <h1 className={css.name}>{name}</h1>
                    <p className={css.articlesCount}>{totalArticles === 1 ? "1 article" : `${totalArticles} articles`}</p>
                </div>

            </div>

            <div className={css.articlesSection} ref={listRef}>
                {hasArticles ? (
                    <ArticlesList articles={articles} />
                ) : (
                    !isLoading && <p className={css.empty}>This author has no articles yet.</p>
                )}
                {hasArticles && canLoadMore && (
                    <div className={css.actions}>
                        <Button
                            type="button"
                            size="md"
                            isLoading={isLoading}
                            loadingText="Loading..."
                            onClick={() => void loadMoreArticles()}
                        >
                            Load more
                        </Button>
                    </div>
                )}
            </div>
        </div>
    );
}