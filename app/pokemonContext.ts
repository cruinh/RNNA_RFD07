import { createContext } from 'react';

export type PokemonContextValue = { 
    pokemon: string | undefined; 
    setPokemon: any;
}

export const PokemonContext = createContext({} as PokemonContextValue);
export default {  }
