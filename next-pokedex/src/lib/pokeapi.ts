import { ChainLink, EvolutionChain, Genus, Name, PaginationInfo, Pokemon, PokemonListResponse, ProcessedAbility, ProcessedEvolutionDetail, ProcessedPokemon } from "./types";

const BASE_URL = 'https://pokeapi.co/api/v2';
const SAFE_POKEMON_LIMIT = 1010;

/**
 * ポケモン一覧を取得する
 */
export async function fetchPokemonList(
  limit: number = 20,
  offset: number = 0
): Promise<PokemonListResponse> {
  // 💡 課題: fetch()を使ってAPIからデータを取得してください
  // エンドポイント: `${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`
  const res = await fetch(`${BASE_URL}/pokemon?limit=${limit}&offset=${offset}`);
  const data = await res.json();

  return {
    count: data.count,
    next: data.next,
    previous: data.previous,
    results: data.results
  }
};

/**
 * 個別のポケモン詳細情報を取得する
 */
export async function fetchPokemon(idOrName: string | number): Promise<Pokemon> {
  // 💡 課題: ポケモンの詳細情報を取得してください
  // エンドポイント: `${BASE_URL}/pokemon/${idOrName}`
  const res = await fetch(`${BASE_URL}/pokemon/${idOrName}`);
  const data = await res.json();

  return {
    id: data.id,
    name: data.name,
    base_experience: data.base_experience,
    height: data.height / 10,// decimetre → m
    weight: data.weight / 10,// hectogram → kg
    order: data.order,
    is_default: data.is_default,
    location_area_encounters: data.location_area_encounters,
    sprites: data.sprites,
    abilities: data.abilities,
    forms: data.forms,
    game_indices: data.game_indices,
    held_items: data.held_items,
    moves: data.moves,
    species: data.species,
    stats: data.stats,
    types: data.types,
  };
}

/**
 * 多言語名前配列から日本語名を取得する
 */
export function getJapaneseName(names: Name[]): string {
  // 💡 課題: 'ja-Hrkt' または 'ja' の言語コードを持つ名前を探してください
  return (
    names.find((n) => n.language.name === 'ja-Hrkt')?.name ??
    names.find((n) => n.language.name === 'ja')?.name ??
    names[0]?.name
  )
}

/**
 * 日本語の分類を取得する
 */
export function getJapaneseGenus(genera: Genus[]): string {
  return (
    genera.find((g) => g.language.name === 'ja-Hrkt')?.genus ??
    genera.find((g) => g.language.name === 'ja')?.genus ??
    '分類なし'
  )
}

/**
 * ポケモンの画像URLを取得する
 */
export function getPokemonImageUrl(sprites: Pokemon['sprites']): string {
  // 💡 課題: official-artwork → home → front_default の優先順位で画像URLを取得
  return (
    sprites.other?.['official-artwork']?.front_default ||
    sprites.other?.home?.front_default ||
    sprites.front_default ||
    '/img/dummy-pokemon.png'
  );
}

// タイプ名の日本語変換テーブル
export const typeTranslations: Record<string, string> = {
  normal: 'ノーマル',
  fire: 'ほのお',
  water: 'みず',
  // 💡 課題: 他のタイプも追加してください
  fighting: 'かくとう',
  flying: 'ひこう',
  poison: 'どく',
  ground: 'じめん',
  rock: 'いわ',
  bug: 'むし',
  ghost: 'ゴースト',
  steel: 'はがね',
  grass: 'くさ',
  electric: 'でんき',
  psychic: 'エスパー',
  ice: 'こおり',
  dragon: 'ドラゴン',
  dark: 'あく',
  fairy: 'フェアリー'
};

/**
 * ポケモン一覧を処理済みデータとして取得する
 */
export async function getProcessedPokemonList(
  page: number = 1,
  limit: number = 20
): Promise<{
  pokemon: ProcessedPokemon[];
  pagination: PaginationInfo;
}> {
  // 💡 課題: ページングを考慮してポケモンデータを取得し、
  // ProcessedPokemon形式に変換してください
  const offset = (page - 1) * limit;

  //一覧取得
  const pokemonList = await fetchPokemonList(limit, offset);

  //詳細情報取得
  const pokemonDetail = await Promise.all(
    pokemonList.results.map(async (p) => {
      const pokemon = await fetchPokemon(p.name);

      //日本語名を取得
      const resSpecies = await fetch(pokemon.species.url);
      const speciesData = await resSpecies.json();
      const japaneseName = getJapaneseName(speciesData.names);
      const japaneseGenus = getJapaneseGenus(speciesData.genera);

      const processed: ProcessedPokemon = {
        id: pokemon.id,
        name: pokemon.name,
        japaneseName: japaneseName,
        imageUrl: getPokemonImageUrl(pokemon.sprites),
        types: pokemon.types.map(t => t.type.name),
        height: pokemon.height,
        weight: pokemon.weight,
        genus: japaneseGenus,
        abilities: []
      }
      return processed;
    })
  );

  const pagination: PaginationInfo = {
    currentPage: page,//今のページ
    totalPages: Math.ceil(SAFE_POKEMON_LIMIT / limit),//総ページ数
    hasNext: page < Math.ceil(SAFE_POKEMON_LIMIT / limit),//次のページがあるか
    hasPrev: page > 1,//前のページがあるか
    totalCount: SAFE_POKEMON_LIMIT//総ポケモン数
  }

  return {
    pokemon: pokemonDetail,
    pagination
  }
}

/**
 * ポケモン単体を処理済みデータとして取得する
 */
export async function getProcessedPokemon(id: number): Promise<ProcessedPokemon> {
  const pokemon = await fetchPokemon(id);
  const resSpecies = await fetch(pokemon.species.url);
  const speciesData = await resSpecies.json();

  //日本語名を取得する
  const japaneseName = getJapaneseName(speciesData.names);

  //日本語で分類を取得する
  const japaneseGenus = getJapaneseGenus(speciesData.genera);

  //日本語で特性を取得する
  const abilities: ProcessedAbility[] = await Promise.all(
    pokemon.abilities.map(async (a) => {
      const resAbilities = await fetch(a.ability.url);
      const abilitiesData = await resAbilities.json();

      const japaneseName = getJapaneseName(abilitiesData.names);
      const japaneseEffect =
        abilitiesData.effect_entries.find((e: { language: { name: string; }; }) => e.language.name === 'ja-Hrkt')?.effect ??
        abilitiesData.effect_entries.find((e: { language: { name: string; }; }) => e.language.name === 'ja')?.effect ??
        '説明なし';

      return {
        name: abilitiesData.name,
        japaneseName,
        description: japaneseEffect,
        isHidden: a.is_hidden,
      };
    })
  );

  return {
    id: pokemon.id,
    name: pokemon.name,
    japaneseName: japaneseName,
    imageUrl: getPokemonImageUrl(pokemon.sprites),
    types: pokemon.types.map(t => t.type.name),
    height: pokemon.height,
    weight: pokemon.weight,
    genus: japaneseGenus,
    abilities
  };
}

/**
 * 進化トリガーの日本語変換テーブル
 */
export const evolutionTriggerTranslations: Record<string, string> = {
  'level-up': 'レベルアップ',
  'trade': '交換',
  'use-item': 'アイテム使用',
  'shed': '空きがある',
  'spin': 'スピン',
  'tower-of-darkness': 'あくの塔',
  'tower-of-waters': '水の塔',
  'three-critical-hits': '3回急所に当てる',
  'take-damage': 'ダメージを受ける',
  'other': 'その他'
};

/**
 * 進化チェーンを取得する
 */
export async function fetchEvolutionChain(id: number): Promise<EvolutionChain> {
  const resSpecies = await fetch(`${BASE_URL}/pokemon-species/${id}`);
  const speciesData = await resSpecies.json();

  const evoRes = await fetch(speciesData.evolution_chain.url);
  const evoData = await evoRes.json();

  return {
    id: evoData.id,
    chain: evoData.chain
  };
}

/**
 * 進化チェーンを処理する
 */
export async function processedChainLink(chainLink: ChainLink): Promise<ProcessedEvolutionDetail> {
  //ID抽出
  const id = Number(chainLink.species.url.split('/').filter(Boolean).pop());

  const resSpecies = await fetch(chainLink.species.url);
  const speciesData = await resSpecies.json();
  const japaneseName = getJapaneseName(speciesData.names);

  const pokemon = await fetchPokemon(id);
  const imageUrl = getPokemonImageUrl(pokemon.sprites);

  // 進化条件
  const firstDetail = chainLink.evolution_details?.[0];
  //日本語に変換
  const trigger = evolutionTriggerTranslations[firstDetail?.trigger?.name ?? ''] ?? '不明';
  const minLevel = firstDetail?.min_level ?? null;

  //次の進化を再帰処理
  const evolvesTo = await Promise.all(
    chainLink.evolves_to.map(evo => processedChainLink(evo))
  );

  return {
    id,
    name: chainLink.species.name,
    japaneseName,
    imageUrl,
    trigger,
    minLevel,
    evolvesTo
  };
}

/**
 * 進化チェーンを処理済みデータとして取得する
 */
export async function getProcessedEvolutionChain(id: number): Promise<ProcessedEvolutionDetail> {
  const evoChain = await fetchEvolutionChain(id);
  return processedChainLink(evoChain.chain);
}