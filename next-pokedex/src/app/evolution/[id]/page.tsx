import { Loading } from '@/components/loading';
import { Suspense } from 'react';
import { getProcessedEvolutionChain } from '@/lib/pokeapi';
import Link from 'next/link';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ProcessedEvolutionDetail } from '@/lib/types';


interface Props {
    params: Promise<{ id: string }>;
}

export default async function EvolutionPage({ params }: Props) {
    const resolvedParams = await params;
    const id = Number(resolvedParams.id);

    return (
        <div className="max-w-4xl mx-auto px-4 py-8">
            <Suspense fallback={<Loading />}>
                <EvolutionPageContent id={id} />
            </Suspense>
        </div>
    );
}

async function EvolutionPageContent({ id }: { id: number }) {
    try {
        const pokemon = await getProcessedEvolutionChain(id);
        return (
            <><Card className='h-full max-auto'>
                <div>
                    <CardHeader className='text-center'>
                        <CardTitle className='text-3xl'>{pokemon.japaneseName}の進化系統図</CardTitle>
                    </CardHeader>
                    <CardContent className='space-y-3'>
                        <EvolutionChainView evo={pokemon} />
                    </CardContent>
                    <div />
                    <CardFooter className='justify-between'>
                    </CardFooter>
                </div>
            </Card>

                {/* 一覧に戻るボタン */}
                <Link href="/pokemon">
                    <Button className="fixed bottom-7 right-7">
                        一覧へ
                    </Button>
                </Link></>
        );
        //エラーハンドリング
    } catch (error) {
        return (
            <p>情報を取得できませんでした。</p>
        );
    }
}

function EvolutionChainView({ evo }: { evo: ProcessedEvolutionDetail }) {
    return (
        <div className='text-center space-y-5'>
            <Link href={`/pokemon/${evo.id}`}>
                <div>
                    <img src={evo.imageUrl} alt={evo.japaneseName} className="mx-auto w-32 h-32" />
                    <p className='text-lg font-bold'>{evo.japaneseName}</p>
                </div>
            </Link>
            {evo.trigger !== '不明' && (
                <p className='text-sm text-gray-500'>
                    条件: {evo.trigger}{evo.minLevel && `（Lv.${evo.minLevel}）`}
                </p>
            )}

            {/* 進化先 */}
            {evo.evolvesTo.length > 0 && (
                <div className='items-center mt-8'>
                    {evo.evolvesTo.map((next) => (
                        <div key={next.id} className='items-center space-y-5'>
                            <span className='text-xl'>↓</span>
                            <EvolutionChainView evo={next} />
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
