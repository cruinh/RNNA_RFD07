import { useState } from "react";
// import PokemonScreen from "./pokemonScreen";
import PokedexScreen from "./pokedexScreen";
import { PokemonContext } from "./pokemonContext";
import PokemonScreen from "./pokemonScreen";

export default function HomeScreen() {
    const [pokemon, setPokemon] = useState<string>()

    // useEffect(() => {
    //     setPokemon("bulbasaur")
    // }, [])

    return (
        <PokemonContext.Provider value={{
            pokemon,
            setPokemon
        }}>
            {pokemon === undefined ?
                <PokedexScreen/>
                : <PokemonScreen/>}
        </PokemonContext.Provider>
    )
}

// function PokemonScreen() {
//     const contextValue = useContext<PokemonContextValue | null>(PokemonContext)
//     const isDarkMode = useColorScheme() === "dark"
//     const styles = StyleSheet.create({
//         background: {
//             backgroundColor: isDarkMode ? "black" : "white"
//         },
//         text: {
//             color: isDarkMode ? "white" : "black"
//         }
//     })

//     return (
//         <SafeAreaView>
//             <View style={styles.background}>
//                 <Pressable onPress={() => {
//                     if (contextValue?.setPokemon !== undefined) {
//                         contextValue.setPokemon(undefined)
//                     }
//                 }}>
//                     <Text style={styles.text}>Back</Text>
//                 </Pressable>
//                 <Text style={styles.text}>{contextValue?.pokemon}</Text>
//             </View>
//         </SafeAreaView>
//     )
// }