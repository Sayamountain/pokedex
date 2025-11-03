import { Loading } from '@/components/loading';
import { Suspense } from 'react';
import { getProcessedPokemon, typeTranslations } from '@/lib/pokeapi';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';


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

    //IDを３桁で表示する
    const digitsId = String(pokemon.id).padStart(3, '0');

    //前後のポケモンのID
    const prevId = id > 1 ? id - 1 : null;
    const nextId = id < 1010 ? id + 1 : null;

    console.log(id, prevId, nextId)

    // 💡 課題: 基本情報（名前、画像、タイプ、高さ、重さ）を表示
    return (
      <><Card className='h-full max-auto'>
        <div>
          <CardHeader className='text-center'>
            <div>
              <p>No.{digitsId}</p>
            </div>
            <CardTitle className='text-2xl'>{pokemon.japaneseName}</CardTitle>
          </CardHeader>
          <CardContent className='space-y-3'>
            <img className='mx-auto' src={pokemon.imageUrl} alt={pokemon.name} />
            <h2 className='text-lg'>基本情報</h2>
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
            <ul className='space-y-2'>
              {pokemon.abilities.map((a) => (
                <li key={a.name}>
                  <p>{a.japaneseName}</p>
                  <p>{a.description}</p>
                </li>
              ))}
            </ul>
          </CardContent>

          <CardFooter className='justify-between'>
            {/* 💡 課題: 前後のポケモンへのナビゲーションボタン */}
            {prevId && (
              <Link href={`/pokemon/${prevId}`}>
                <Button variant='outline'>←前へ</Button>
              </Link>
            )}

            {nextId && (
              <Link href={`/pokemon/${nextId}`}>
                <Button variant='outline'>次へ→</Button>
              </Link>
            )}
          </CardFooter>
        </div>
      </Card>

        {/* 一覧に戻るボタン */}
        <Link href="/pokemon">
          <Button variant="secondary" className="fixed bottom-7 right-7">
            一覧へ
          </Button>
        </Link></>

    );
    // 💡 課題: エラーハンドリング
  } catch (error) {
    return (
      <p>情報を取得できませんでした。</p>
    );
  }
}