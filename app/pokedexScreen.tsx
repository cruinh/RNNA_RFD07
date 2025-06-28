import { FlatList, Pressable, SafeAreaView, StyleSheet, Text, useColorScheme, View } from 'react-native';

import { Colors } from '@/constants/Colors';
import { useCallback, useContext, useEffect, useState } from 'react';
import { PokemonContext } from './pokemonContext';

interface PokedexEntry {
  name: string
  url: string
}

const initialData: PokedexEntry[] = []
const firstFetch = "https://pokeapi.co/api/v2/pokemon/?limit=80&offset=0"

export default function PokedexScreen() {
  const [data, setData] = useState(initialData)
  const [nextFetch, setNextFetch] = useState(firstFetch)
  const [fetchError, setFetchError] = useState()
  const [loading, setLoading] = useState(false)
  const contextValue = useContext(PokemonContext)
  const isDarkMode = useColorScheme() === 'dark'

  const styles = StyleSheet.create({
    background: {
      backgroundColor: isDarkMode ? Colors.dark.background : Colors.light.background
    },
    text: {
      fontSize: 40,
      color: isDarkMode ? Colors.dark.text : Colors.light.text
    }
  })

  const executeNextFetch = () => {
    if (loading) return
    setLoading(true)
    // console.debug(`executeNextFetch: `, nextFetch)
    const headers = new Headers()
    headers.set('Content-Type', 'application/json')
    const requestOptions = {
      method: 'GET',
      headers: headers
    }

    fetch(nextFetch, requestOptions)
      .then((response) => response.json())
      .then((json) => {
        const { count, next, results } = json
        setNextFetch(next)
        // console.debug(count)
        // console.debug(`next: `, next)
        // console.debug(`results: `, results)
        let newResults: PokedexEntry[] = results.filter((result: PokedexEntry) => {
          const found = data.find((item) => item.name === result.name)
          return found === undefined
        })
        // console.debug(`newResults: `, newResults)
        setData([...data, ...newResults])
        setLoading(false)
      })
      .catch((reason) => {
        console.error(reason)
      })
  }

  useEffect(() => {
    // console.debug('useEffect []')
    executeNextFetch()
  }, [])

  const loadMore = useCallback(() => {
    // console.debug('loadMore')
    executeNextFetch()
  }, [loading])

  const Item = (props: { item: PokedexEntry }) => {
    const { item: {name}} = props
    return (
      <View>
        <Pressable onPress={() => {
          contextValue.setPokemon(name)
        }}>
          <Text style={styles.text}>{name}</Text>
        </Pressable>
      </View>
    )
  }

  return (
    <SafeAreaView style={styles.background}>
      <FlatList
        data={data}
        renderItem={({ item }) => Item({ item })}
        keyExtractor={item => item.name}
        onEndReached={() => loadMore()}
        onEndReachedThreshold={0.75}
      />
    </SafeAreaView>
  );
}