import { getProcessedPokemonList } from "@/lib/pokeapi";
import { PokemonCard } from "./pokemon-card";
import { ProcessedPokemon, PaginationInfo } from "@/lib/types";

interface Props {
  query: string;
  page?: number;
}

//配列を分割する
export function split(array: string | any[], chunkSize: number) {
  if (chunkSize <= 0) throw new Error("chunkSize must be greater than 0");
  const result = [];
  for (let i = 0; i < array.length; i += chunkSize) {
    result.push(array.slice(i, i + chunkSize));
  }
  return result;
}

async function fetchDataInChunks(ids: number[], chunkSize: number): Promise<ProcessedPokemon[]> {
  // IDをチャンクごとに分割
  const idChunks = split(ids, chunkSize);

  const results = await Promise.all(
    idChunks.map(async (chunk) => {
      const startId = chunk[0];
      const limit = chunk.length;
      const { pokemon } = await getProcessedPokemonList(startId, limit);
      return pokemon;
    })
  );

  return results.flat();
}

// 検索結果を表示する
export async function SearchResults({ query, page = 1 }: Props) {
  const FETCH_CHUNK_SIZE = 100;//1リクエストあたりの最大取得数
  const allIds = Array.from({ length: 1010 }, (_, i) => i + 1);

  //分割して取得する
  const allPokemon = await fetchDataInChunks(allIds, FETCH_CHUNK_SIZE);

  //部分一致で検索する
  const filtered = allPokemon.filter((p: { japaneseName: string; }) =>
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