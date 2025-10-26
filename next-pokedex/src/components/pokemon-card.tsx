"use client";

import Link from 'next/link';
import Image from 'next/image';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ProcessedPokemon } from '@/lib/types';

interface PokemonCardProps {
  pokemon: ProcessedPokemon;
}

export function PokemonCard({ pokemon }: PokemonCardProps) {
  return (
    <Link href={`/pokemon/${pokemon.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
        <CardContent className="p-4">
          <div className="text-center">
            {/* 💡 課題: ポケモン画像を表示してください */}
            {/* - Imageコンポーネントを使用 */}
            {/* - pokemon.imageUrl を src に設定 */}
            <img src={pokemon.imageUrl} alt={pokemon.name} />
            {/* - レスポンシブ対応 */}

            {/* 💡 課題: ポケモン番号を3桁で表示してください（例: No. 001） */}

            {/* 💡 課題: ポケモンの日本語名を表示してください */}
            <h1>{pokemon.name}</h1>
            {/* 💡 課題: タイプをBadgeで表示してください */}
            {/* - pokemon.types をmap()で処理 */}
            {/* - typeTranslations で日本語変換 */}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
}