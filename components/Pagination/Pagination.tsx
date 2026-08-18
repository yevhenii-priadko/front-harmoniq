'use client';

import ReactPaginate from 'react-paginate';
import { useEffect, useState } from 'react';
import css from './Pagination.module.css';

type PaginationProps = {
  pageCount: number;
  currentPage: number; 
  onPageChange: (selectedPage: number) => void;
};

export default function Pagination({
  pageCount,
  currentPage,
  onPageChange,
}: PaginationProps) {
  const [pageRange, setPageRange] = useState(1);

  useEffect(() => {
    const tabletMedia = window.matchMedia('(min-width: 768px)');
    const desktopMedia = window.matchMedia('(min-width: 1440px)');

    const updatePageRange = () => {
      if (desktopMedia.matches) {
        setPageRange(4);
      } else if (tabletMedia.matches) {
        setPageRange(2);
      } else {
        setPageRange(1);
      }
    };

    updatePageRange();

    tabletMedia.addEventListener('change', updatePageRange);
    desktopMedia.addEventListener('change', updatePageRange);

    return () => {
      tabletMedia.removeEventListener('change', updatePageRange);
      desktopMedia.removeEventListener('change', updatePageRange);
    };
  }, []);

  if (pageCount <= 1) return null;

  return (
    <ReactPaginate
      breakLabel="..."
      nextLabel={
        <>
            <svg className={css.longArrow} aria-hidden="true">
                <use href="/sprite.svg#icon-arrows-right" />
            </svg>
        </>
      }
      previousLabel={
        <>
            <svg className={css.longArrow} aria-hidden="true">
                <use href="/sprite.svg#icon-arrows-left" />
            </svg>
        </>
      }
      onPageChange={(event) => onPageChange(event.selected + 1)}
      pageRangeDisplayed={pageRange}
      marginPagesDisplayed={1}
      pageCount={pageCount}
      forcePage={currentPage - 1}
      containerClassName={css.pagination}
      pageClassName={css.pageItem}
      pageLinkClassName={css.pageLink}
      previousClassName={css.arrowItem}
      previousLinkClassName={css.arrowLink}
      nextClassName={css.arrowItem}
      nextLinkClassName={css.arrowLink}
      activeClassName={css.active}
      disabledClassName={css.disabled}
      breakClassName={css.breakItem}
      breakLinkClassName={css.breakLink}
    />
  );
}