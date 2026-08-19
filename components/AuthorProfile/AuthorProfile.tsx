'use client';

import { Suspense, useEffect, useRef, useState } from 'react';
import Image from 'next/image';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import ArticlesList from '@/components/ArticlesList/ArticlesList';
import ErrorNotification from '@/components/ErrorNotification/ErrorNotification';
import Pagination from '@/components/Pagination/Pagination';
import {
    fetchAuthorArticlesClient,
    type Author,
    type Article,
    type ArticlesResponse,
} from '@/lib/api/clientApi';
import { getAvatarSrc } from '@/lib/profile/userProfile';
import css from './AuthorProfile.module.css';

const ARTICLES_PER_PAGE = 12;

type AuthorProfileProps = {
    author: Author;
    initialArticlesData: ArticlesResponse;
    initialError?: string;
};

const getInitial = (name: string) => name.trim().charAt(0).toUpperCase() || 'A';

function AuthorProfileContent({
    author,
    initialArticlesData,
    initialError = '',
}: AuthorProfileProps) {
    const router = useRouter();
    const pathname = usePathname();
    const searchParams = useSearchParams();

    const initialPage = initialArticlesData.page || 1;
    const urlPage = (() => {
        const parsed = Number(searchParams.get('page'));
        return parsed > 0 ? parsed : initialPage;
    })();
    const isDeepLinkedPage = urlPage !== initialPage;

    const [articles, setArticles] = useState<Article[]>(
        isDeepLinkedPage ? [] : initialArticlesData.articles
    );
    const [page, setPage] = useState(urlPage);
    const [totalPages, setTotalPages] = useState(initialArticlesData.totalPages || 1);
    const [totalArticles, setTotalArticles] = useState(
        initialArticlesData.totalArticles ?? initialArticlesData.articles.length
    );
    const [isLoading, setIsLoading] = useState(isDeepLinkedPage);
    const [error, setError] = useState(initialError);

    const isFirstRender = useRef(true);

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false;

            if (page === initialPage) {
                return;
            }
        }

        const loadArticles = async () => {
            setIsLoading(true);
            setError('');

            try {
                const data = await fetchAuthorArticlesClient(
                    author._id,
                    page,
                    ARTICLES_PER_PAGE
                );

                setArticles(data.articles);
                setTotalPages(data.totalPages);

                if (data.totalArticles !== undefined) {
                    setTotalArticles(data.totalArticles);
                }
            } catch {
                setError('Unable to load articles. Please try again later.');
            } finally {
                setIsLoading(false);
            }
        };

        loadArticles();
    }, [author._id, page, initialPage]);

    const handlePageChange = (nextPage: number) => {
        if (nextPage === page || nextPage < 1 || nextPage > totalPages) {
            return;
        }

        setPage(nextPage);

        const params = new URLSearchParams(searchParams.toString());

        if (nextPage > 1) {
            params.set('page', String(nextPage));
        } else {
            params.delete('page');
        }

        const query = params.toString();
        router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });

        window.scrollTo({
            top: 0,
            behavior: 'smooth',
        });
    };

    const name = author.username || author.email || 'Author';
    const avatarSrc = getAvatarSrc(author.avatar);

    const hasArticles = articles.length > 0;

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
                    <p className={css.articlesCount}>
                        {totalArticles === 1 ? '1 article' : `${totalArticles} articles`}
                    </p>
                </div>
            </div>

            <div className={css.articlesSection}>
                {hasArticles ? (
                    <ArticlesList articles={articles} />
                ) : (
                    !isLoading && <p className={css.empty}>This author has no articles yet.</p>
                )}

                {hasArticles && totalPages > 1 && (
                    <Pagination
                        pageCount={totalPages}
                        currentPage={page}
                        onPageChange={handlePageChange}
                    />
                )}
            </div>
        </div>
    );
}

export default function AuthorProfile(props: AuthorProfileProps) {
    return (
        <Suspense fallback={null}>
            <AuthorProfileContent {...props} />
        </Suspense>
    );
}
