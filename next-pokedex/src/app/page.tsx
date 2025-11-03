import { Button } from "@/components/ui/button";
import { Card, CardAction, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import Link from "next/link";

export default function Home() {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <main>
        <h1 className="text-3xl font-bold text-center mb-8">ポケモン図鑑</h1>
        <Card className='h-full mx-auto mb-10'>
          <CardHeader>
            <CardTitle className="text-lg">ポケモン一覧</CardTitle>
            <CardDescription>
              ポケモンを一覧で表示します。
            </CardDescription>
            <CardAction>
              <Button variant='secondary'>
                <Link href='/pokemon'>一覧を見る</Link>
              </Button>
            </CardAction>
          </CardHeader>
        </Card>

        <Card className='h-full mx-auto'>
          <CardHeader>
            <CardTitle className="text-lg">ポケモン検索</CardTitle>
            <CardDescription>
              名前でポケモンを検索できます。
            </CardDescription>
            <CardAction>
              <Button variant='secondary'>
                <Link href='/search'>検索する</Link>
                </Button>
            </CardAction>
          </CardHeader>
        </Card>
      </main>
    </div >
  );
}
