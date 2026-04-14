import {
  FavoritePokemons,
  PokemonGrid,
  PokemonResponse,
  SimplePokemon,
} from '@/pokemons';
import { useAppSelector } from '@/store';
import Image from 'next/image';
import { notFound } from 'next/navigation';
import { IoHeartOutline } from 'react-icons/io5';

export const metadata = {
  title: 'Favoritos',
  description: 'lorem',
};

export default async function PokemonsPage() {
  return (
    <div className="flex flex-col">
      <span className="text-5xl my-2">
        Pokemons Favoritos <small className="text-blue-500">Global State</small>
      </span>
      {/* <PokemonGrid pokemons={[]} /> */}
      <FavoritePokemons />
    </div>
  );
}
