import { Loading } from '@/components/loading';
import { PokemonCard } from '@/components/pokemon-card';
import { SearchForm } from '@/components/search-form';
import { getProcessedPokemonList } from '@/lib/pokeapi';
import { Suspense } from 'react';

interface SearchParams {
  q?: string;
  page?: string;
}

interface Props {
  searchParams: SearchParams;
}

// 検索結果を表示する
export async function SearchResults({ query }: { query: string }) {
  //全ポケモン取得
  const allPokemon = await getProcessedPokemonList(1, 100);

  const filtered = allPokemon.pokemon.filter(p =>
    p.japaneseName.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    return <p className="text-center mt-8">該当するポケモンが見つかりません。</p>;
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
      {filtered.map(p => (
        <PokemonCard key={p.id} pokemon={p} />
      ))
      }
    </div>
  );
}

export default async function SearchPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const query = resolvedParams.q || '';

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン検索</h1>

      {/* 💡 課題: SearchFormコンポーネントを配置 */}
      <SearchForm />
      {query && (
        <Suspense fallback={<Loading />}>
          {/* 💡 課題: 検索結果を表示するコンポーネント */}
          <SearchResults query={query} />
        </Suspense>
      )}
    </div>
  );
}
