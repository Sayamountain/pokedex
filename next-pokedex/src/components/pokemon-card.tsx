"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedPokemon } from '@/lib/types';
import { typeTranslations } from '@/lib/pokeapi';

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  //IDを３桁で表示する
  const digitsId = String(pokemon.id).padStart(3, '0');

  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="text-center">
            {/* 💡 課題: ポケモン画像を表示してください */}
            {/* - Imageコンポーネントを使用 */}
            {/* - pokemon.imageUrl を src に設定 */}
            {/* - レスポンシブ対応 */}
            <div className="relative w-32 h-32 mb-3">
              <Image
                src={pokemon.imageUrl}
                alt={pokemon.japaneseName}
                sizes='(max-width: 768px) 100vw, 50vw'
                className="object-cover"
                fill
              />
            </div>

            {/* 💡 課題: ポケモン番号を3桁で表示してください（例: No. 001） */}
            <p>No.{digitsId}</p>

            {/* 💡 課題: ポケモンの日本語名を表示してください */}
            <p>{pokemon.japaneseName}</p>

            {/* 💡 課題: タイプをBadgeで表示してください */}
            {/* - pokemon.types をmap()で処理 */}
            {/* - typeTranslations で日本語変換 */}
            {pokemon.types.map((type) => (
              <Badge
                key={type}
                variant="secondary"
                className="text-xs px-2 py-0.5"
              >
                {typeTranslations[type] ?? type}
              </Badge>
            ))}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}