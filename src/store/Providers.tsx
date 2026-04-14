'use client';
import { Provider } from 'react-redux';
import { store } from './index';
import { useEffect } from 'react';
import { setFavoritePokemons } from './pokemons/pokemons';

interface Props {
  children: React.ReactNode;
}

export const Providers = ({ children }: Props) => {
  useEffect(() => {
    const favorites = JSON.parse(
      localStorage.getItem('favorite-pokemons') ?? '{}'
    );
    console.log(favorites);
    store.dispatch(setFavoritePokemons(favorites));
  }, []);

  return <Provider store={store}>{children}</Provider>;
};

/* Este provider lo creamos xq hacía falta tener contenido dinamico usando
use client y no se podia usar directamente sobre el layout asi que se creó este */
