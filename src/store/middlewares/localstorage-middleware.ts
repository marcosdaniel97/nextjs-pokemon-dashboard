import { Action, Dispatch, MiddlewareAPI, Middleware } from '@reduxjs/toolkit';
import { toggleFavorite } from '../pokemons/pokemons';

import { RootState } from '..';

// esto seria un middleware que intercepta cualquier accion al state

export const localStorageMiddleware: Middleware =
  (store) => (next) => (action) => {
    const result = next(action);

    if (toggleFavorite.match(action)) {
      const pokemons = store.getState().pokemons;
      localStorage.setItem('favorite-pokemons', JSON.stringify(pokemons));
    }

    return result;
  };

/* export const localStorageMiddleware = (state: MiddlewareAPI) => {
  return (next: Dispatch) => (action: Action) => {
    next(action);

    if (action.type === 'pokemons/toggleFavorite') {
      const { pokemons } = state.getState() as RootState;
      localStorage.setItem('favorite-pokemons', JSON.stringify(pokemons));
      return;
    }
  };
}; */
