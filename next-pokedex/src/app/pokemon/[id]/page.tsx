import { Loading } from '@/components/loading';
import { Suspense } from 'react';
import { getProcessedPokemon } from '@/lib/pokeapi';

interface Props {
  params: Promise<{ id: string }>;
}

export default async function PokemonDetailPage({ params }: Props) {
  const resolvedParams = await params;
  const id = Number(resolvedParams.id);

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <Suspense fallback={<Loading />}>
        <PokemonDetailContent id={id} />
      </Suspense>
    </div>
  );
}

async function PokemonDetailContent({ id }: { id: number }) {
  // 💡 課題: getProcessedPokemon()でポケモンの詳細情報を取得
  const pokemon = await getProcessedPokemon(id);
  // 💡 課題: 基本情報（名前、画像、タイプ、高さ、重さ）を表示
  return (
    <div>
      <h1>{pokemon.japaneseName}</h1>
      <img src={pokemon.imageUrl} alt={pokemon.name} />
      <p>タイプ：{pokemon.types}</p>
      <p>高さ: {pokemon.height}m / 重さ: {pokemon.weight}kg</p>
      <p>分類：{pokemon.genus}</p>
      <h2>特性</h2>
      <ul className="space-y-2">
        {pokemon.abilities.map((a) => (
          <p>{a.japaneseName}</p>
        ))}
      </ul>
    </div>

  );
  // 💡 課題: 前後のポケモンへのナビゲーションボタン
  // 💡 課題: エラーハンドリング
}