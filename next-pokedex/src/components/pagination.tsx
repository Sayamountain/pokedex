"use client";

import {
  Pagination,
  PaginationContent,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination';
import { PaginationInfo } from '@/lib/types';

interface PaginationComponentProps {
  pagination: PaginationInfo;
  basePath: string;
}

export function PaginationComponent({ pagination, basePath }: PaginationComponentProps) {
  const { currentPage, totalPages, hasNext, hasPrev } = pagination;

  //表示されるページの制御
  const start = Math.max(1, currentPage - 2);
  const end = Math.min(totalPages, currentPage + 2);

  const pages = [];
  for (let i = start; i <= end; i++) {
    pages.push(i);
  }

  return (
    <Pagination>
      <PaginationContent>
        {/* 💡 課題: 前のページボタンを実装してください */}
        {/* - hasPrev が true の時のみ表示 */}
        {hasPrev && (
          <PaginationItem>
            <PaginationPrevious href={`${basePath}?page=${currentPage - 1}`} />
          </PaginationItem>
        )}

        {/* 💡 課題: ページ番号のリンクを実装してください */}
        {/* - 現在のページをハイライト */}
        {pages.map((pageNum) => (
          <PaginationItem key={pageNum}>
            <PaginationLink
              href={`${basePath}?page=${pageNum}`}
              isActive={pageNum === currentPage}
            >
              {pageNum}
            </PaginationLink>
          </PaginationItem>
        ))}

        {/* 💡 課題: 次のページボタンを実装してください */}
        {/* - hasNext が true の時のみ表示 */}
        {hasNext && (
          <PaginationItem>
            <PaginationNext href={`${basePath}?page=${currentPage + 1}`} />
          </PaginationItem>
        )}
      </PaginationContent>
    </Pagination>
  );
}