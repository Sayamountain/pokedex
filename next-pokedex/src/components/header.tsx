"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';

export function Header() {
  const pathname = usePathname();

  const navigationItems = [
    { href: '/', label: 'ホーム' },
    { href: '/pokemon', label: 'ポケモン一覧' },
    { href: '/search', label: 'ポケモン検索' },
  ];

  return (
    <header className="bg-white shadow-sm border-b">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <Link href="/" className="text-xl font-bold text-blue-600">
            ポケモン図鑑
          </Link>

          {/* 💡 課題: ナビゲーションメニューを実装してください */}
          {/* - デスクトップ用とモバイル用の両方 */}
          {/* - 現在のページをハイライト */}
        </div>
      </div>
    </header>
  );
}