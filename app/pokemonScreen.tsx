import { Colors } from "@/constants/Colors"
import { useContext, useEffect, useState } from "react"
import { Image, Pressable, ScrollView, StyleSheet, Text, useColorScheme, View } from "react-native"
import { SafeAreaView } from "react-native-safe-area-context"
import { PokemonContext } from "./pokemonContext"

const createStyleSheet = (isDarkMode: boolean): any => {
    const styles = StyleSheet.create({
        background: {
            flex: 1,
            backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background
        },
        text: {
            fontSize: 40,
            color: isDarkMode ? Colors.dark.text : Colors.light.text
        },
        backButton: {
            fontSize: 40,
            color: isDarkMode ? Colors.dark.text : Colors.light.text,
            paddingBottom: 10
        },
        detailText: {
            fontSize: 40,
            color: isDarkMode ? Colors.dark.text : Colors.light.text
        },
        sprite: {
            width: 200,
            height: 200,
            resizeMode: 'contain'
        },
        spriteRow: {
            flexDirection: 'row',
            justifyContent: 'center',
            alignItems: 'center',
            gap: 3 // if you're using RN >= 0.71
        },
        spritesContainer: {
            margin: 5
        },
        flavorTextContainer: {
            margin: 5
        },
        flavorText: {
            fontSize: 20,
            color: isDarkMode ? Colors.dark.text : Colors.light.text
        },
        flavorTextCount: {
            fontSize: 20,
            color: isDarkMode ? Colors.dark.text : Colors.light.text
        }
    })
    return styles
}

export interface FlavorText {
    flavor_text: string
}

type PokemonDetails = {
    name: string
    id: number,
    sprites: {
        front_default: string,
        back_default: string,
        front_female: string,
        back_female: string,
        front_shiny: string,
        back_shiny: string,
        front_shiny_female: string,
        back_shiny_female: string
    }
}

type SpeciesDetails = {
    name: string,
    url: string,
    flavor_text_entries: FlavorText[]
}

export default function PokemonScreen() {
    const contextValue = useContext(PokemonContext)
    const isDarkMode = useColorScheme() === 'dark'
    const [fetchError, setFetchError] = useState()
    const [loading, setLoading] = useState(false)
    const [pokemonDetails, setPokemonDetails] = useState<PokemonDetails | undefined>()
    const [speciesDetails, setSpeciesDetails] = useState<SpeciesDetails | undefined>()
    const [styles, setStyles] = useState(createStyleSheet(isDarkMode))
    const [flavorTextIndex, setFlavorTextIndex] = useState(0)

    const fetchData = () => {
        if (loading || contextValue === undefined) return
        setLoading(true)

        const headers = new Headers()
        headers.set('ContentType', 'application/json')
        const requestOptions = {
            method: 'GET',
            headers
        }

        const pokemonName = contextValue?.pokemon
        const url = `https://pokeapi.co/api/v2/pokemon/${pokemonName}`

        fetch(url, requestOptions)
            .then((response) => response.json())
            .then((json) => {
                setPokemonDetails(json)
                // console.debug(`sprites: `, json.sprites)
                // console.debug(`front_default: `, json.sprites.front_default)
                return json.species.url
            })
            .then(async (speciesURL) => {
                const speciesResponse = await fetch(speciesURL, requestOptions)
                const json = await speciesResponse.json()
                setSpeciesDetails(json)
            })
    }

    useEffect(() => {
        // console.debug('useEffect []')
        fetchData()
    }, [])

    useEffect(() => {
        setStyles(createStyleSheet(isDarkMode))
    }, [isDarkMode])

    const Sprite = (props: { src: string }) => {
        // console.log("Sprite src:", props.src)
        return (
            <Image style={styles.sprite} source={{ uri: props.src }} />
        )
    }

    const SpritesSection = (props: { title: string, frontUrl?: string, backUrl?: string }) => {
        const { title, frontUrl, backUrl } = props
        // console.log("Sprites title:", title)
        return (
            <>
                {(frontUrl && backUrl) ?

                    <View style={styles.spritesContainer}>
                        <Text style={styles.detailText}>{title}</Text>
                        <View style={styles.spriteRow}>
                            <Sprite src={frontUrl} />
                            <Sprite src={backUrl} />
                        </View>
                    </View>
                    : null
                }
            </>
        )
    }

    const FlavorTextSection = (props: { flavorTexts?: FlavorText[], flavorTextIndex: number}) => {
        const {flavorTexts : flavorTexts, flavorTextIndex} = props
        let selectedFlavorText = flavorTexts ? flavorTexts[flavorTextIndex].flavor_text : ""
        selectedFlavorText = selectedFlavorText.split('\n').join(' ').split('\f').join(' ')
        return (
            <>
                { flavorTexts ? 
                    <Pressable onPress={() => {
                        let nextIndex = flavorTextIndex + 1
                        if (nextIndex >= flavorTexts.length) {
                            nextIndex = 0
                        }
                        setFlavorTextIndex(nextIndex)
                       } 
                    }>
                        <View style={styles.flavorTextContainer}>
                            <Text style={styles.flavorText}>{selectedFlavorText}</Text>
                            <Text style={styles.flavorTextCount}>{`${flavorTextIndex}/${flavorTexts?.length}`}</Text>
                        </View>
                    </Pressable>
                    : null
                }
            </>
        )
    }

    const sprites = pokemonDetails?.sprites
    const flavorTexts = speciesDetails?.flavor_text_entries

    return (
        <SafeAreaView style={styles.background}>
            <ScrollView>
                <Pressable onPress={() => {
                    if (contextValue?.setPokemon !== undefined) {
                        contextValue.setPokemon(undefined)
                    }
                }}>
                    <Text style={styles.backButton}>{`<- Back`}</Text>
                </Pressable>
                <Text style={styles.text}>{`${contextValue?.pokemon} (${pokemonDetails?.id})`}</Text>
                <FlavorTextSection flavorTexts={flavorTexts} flavorTextIndex={flavorTextIndex}/>
                <SpritesSection title="Default" frontUrl={sprites?.front_default} backUrl={sprites?.back_default} />
                <SpritesSection title="Female" frontUrl={sprites?.front_female} backUrl={sprites?.back_female} />
                <SpritesSection title="Shiny" frontUrl={sprites?.front_shiny} backUrl={sprites?.back_shiny} />
                <SpritesSection title="Shiny Female" frontUrl={sprites?.front_shiny_female} backUrl={sprites?.back_shiny_female} />
            </ScrollView>
        </SafeAreaView>
    )
}