import { SimplePokemon } from '@/pokemons';
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

/* 
    1ra Alternativa: No aconsejable
    [
        { id: '1', name: 'bulbasaur' },
        { id: '2', name: 'ivysaur' }
    ]
  2da Alternativa: Mejor, es la que vamos a usar
  {
  pokemons:[], // podriamos tener esto pero en este caso, no  
  favorites{
        '1': {id:'1',name: 'bulbasaur'}
        '2': {id:'2',name: 'bulbasaur'}
    }
}
*/
// Esta interfaz es como el ej de 2da alternativa
// quiere decir que la clave va a ser string, el nombre puede ser cualquiera y
// no se va a usar en el codigo, solo hace referencia a que la clave del objeto
// va a ser de tipo string. No puedo hacer state[key]. Debe ser state['2']
interface PokemonsState {
  favorites: { [key: string]: SimplePokemon };
}

/* const getInitialState = (): PokemonsState => {
  //if (typeof localStorage === 'undefined') return {};
  // .parse convierte JSON en un objeto. entonces leemos string de localStorage
  // y creamos un objeto con los pokemones con sus claves y valor
  const favorites = JSON.parse(
    localStorage.getItem('favorite-pokemons') ?? '{}'
  );
  return favorites;
}; */

const initialState: PokemonsState = {
  favorites: {},
  //...getInitialState(),
  /* '1': { id: '1', name: 'bulbasaur' },
  '4': { id: '4', name: 'charmander' },
  '6': { id: '6', name: 'charizard' }, */
};

const pokemonsSlice = createSlice({
  name: 'pokemons',
  initialState,
  reducers: {
    // state representa el estado actual del slice pokemons
    // action es un obj que tiene: type(ident que acción es->pokemons/toggleFavorite)
    // y payload es el pokemon
    // usamos PayloadAction para saber que tipo es payload
    toggleFavorite(state, action: PayloadAction<SimplePokemon>) {
      const pokemon = action.payload;
      const { id } = pokemon;

      if (!!state.favorites[id]) {
        delete state.favorites[id];
        //return;
      } else {
        state.favorites[id] = pokemon;
      }
      //TODO: No se debe hacer en Redux
      localStorage.setItem(
        'favorite-pokemons',
        JSON.stringify(state.favorites)
      );
    },
    setFavoritePokemons(
      state,
      action: PayloadAction<{ [key: string]: SimplePokemon }>
    ) {
      state.favorites = action.payload;
    },
  },
});

export const { toggleFavorite, setFavoritePokemons } = pokemonsSlice.actions;

export default pokemonsSlice.reducer;
