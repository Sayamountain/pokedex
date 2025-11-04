import { getProcessedPokemonList } from "@/lib/pokeapi";
import { PokemonCard } from "./pokemon-card";

interface Props {
  query: string;
  page?: number;
}

// 検索結果を表示する
export async function SearchResults({ query,page =1 }: Props) {
  //全ポケモン取得
  const allPokemon = await getProcessedPokemonList(1, 100);

  const filtered = allPokemon.pokemon.filter(p =>
    p.japaneseName.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    return <p className="text-center mt-8">該当するポケモンが見つかりません。</p>;
  }

  //１ページ10件まで表示する
  const pageSize = 10;
  const start = (page - 1) * pageSize;
  const end = start + pageSize;
  const paginated = filtered.slice(start, end);

  return (
    <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 mt-8">
      {paginated.map(p => (
        <PokemonCard key={p.id} pokemon={p} />
      ))
      }
    </div>
  );
}