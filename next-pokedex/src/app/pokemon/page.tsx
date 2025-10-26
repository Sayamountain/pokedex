import { Loading } from '@/components/loading';
import { getProcessedPokemonList } from '@/lib/pokeapi';
import { Suspense } from 'react';

interface SearchParams {
  page?: string;
}

interface Props {
  searchParams: Promise<SearchParams>;
}

export default async function PokemonListPage({ searchParams }: Props) {
  const resolvedParams = await searchParams;
  const currentPage = Number(resolvedParams.page) || 1;

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-center mb-8">ポケモン一覧</h1>

      <Suspense fallback={<Loading />}>
        <PokemonListContent page={currentPage} />
      </Suspense>
    </div>
  );
}

async function PokemonListContent({ page }: { page: number }) {
  // 💡 課題: getProcessedPokemonList()を使ってポケモンデータを取得
  const { pokemon, pagination } = await getProcessedPokemonList(page, 20);
  // 💡 課題: PokemonCardコンポーネントでグリッド表示
  return (
    <><ul>
      {pokemon.map(p => (
        <><li key={p.id}>{p.id}</li>
          <li key={p.japaneseName}>{p.japaneseName}</li>
          <img src={p.imageUrl} alt={p.name} />
        </>
      ))}
    </ul></>
  )
  // return(
  // )
  // 💡 課題: PaginationComponentでページング
}