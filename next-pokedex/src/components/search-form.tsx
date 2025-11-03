"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Button } from './ui/button';
import { Input } from './ui/input';

interface SearchFormProps {
  initialQuery?: string;
}

export function SearchForm({ initialQuery = '' }: SearchFormProps) {
  const [query, setQuery] = useState(initialQuery);
  const router = useRouter();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // 💡 課題: 検索クエリで /search ページに遷移
    router.push(`/search?q=${encodeURIComponent((query))}`);
  };

  return (
    <form onSubmit={handleSubmit} className="flex gap-2">
      {/* 💡 課題: 検索用のInputとButtonを配置 */}
      <Input
        type='text'
        placeholder='ポケモンの名前を入力'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
      />

      <Button type='submit'>
        検索
      </Button>
    </form>
  );
}