import { Loading } from '@/components/loading';
import { Suspense } from 'react';
import { getProcessedPokemon, typeTranslations } from '@/lib/pokeapi';
import Link from 'next/link';


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
  try {
    // 💡 課題: getProcessedPokemon()でポケモンの詳細情報を取得
    const pokemon = await getProcessedPokemon(id);

    //前後のポケモンのID
    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null;

    console.log(id, prevId, nextId)

    // 💡 課題: 基本情報（名前、画像、タイプ、高さ、重さ）を表示
    return (
      <div>
        <h1>{pokemon.japaneseName}</h1>
        <img src={pokemon.imageUrl} alt={pokemon.name} />
        <h2>基本情報</h2>
        <p>高さ: {pokemon.height}m</p>
        <p>重さ: {pokemon.weight}kg</p>
        <p>分類：{pokemon.genus}</p>
        <ul>タイプ：{pokemon.types.map((type) => (
          <span
            key={type}
          >
            {typeTranslations[type] ?? type}
          </span>
        ))}
        </ul>
        <p>特性</p>
        <ul className="space-y-2">
          {pokemon.abilities.map((a) => (
            <p>{a.japaneseName}</p>
          ))}
        </ul>

        {/* 💡 課題: 前後のポケモンへのナビゲーションボタン */}
        <div>
          {prevId && (
            <Link href={`/pokemon/${prevId}`}>← 前へ</Link>
          )}

          {nextId && (
            <Link href={`/pokemon/${nextId}`}>次へ →</Link>
          )}
        </div>
      </div>
    );
    // 💡 課題: エラーハンドリング
  } catch (error) {
    return (
      <p>情報を取得できませんでした。</p>
    );
  }
}