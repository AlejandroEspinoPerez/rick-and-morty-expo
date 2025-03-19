import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
} from "react-native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchCharacters } from "../services/rickAndMortyService";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [characters, setCharacters] = useState<any[]>([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);

  useEffect(() => {
    loadCharacters();
  }, []);

  const loadCharacters = async () => {
    if (!nextPage) return;
    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    const { characters: newCharacters, nextPage: newNextPage } =
      await fetchCharacters(page);

    setCharacters((prev) => [...prev, ...newCharacters]); // Agregar nuevos personajes a la lista
    setNextPage(newNextPage);
    setLoading(false);
    setLoadingMore(false);
    setPage((prev) => prev + 1);
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B5CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={characters}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.item}
            onPress={() =>
              navigation.navigate("Details", { characterId: item.id })
            }
          >
            <Image source={{ uri: item.image }} style={styles.image} />
            <Text style={styles.title}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          nextPage ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadCharacters}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.loadMoreText}>Cargar Más</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreText}>No hay más personajes</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  item: {
    flexDirection: "row",
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  image: {
    width: 75,
    height: 75,
    borderRadius: 10,
  },
  title: {
    marginLeft: 10,
    fontSize: 18,
    alignSelf: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  loadMoreButton: {
    backgroundColor: "#00B5CC",
    padding: 10,
    marginVertical: 20,
    borderRadius: 5,
    alignItems: "center",
    alignSelf: "center",
    width: 150,
  },
  loadMoreText: {
    color: "#FFF",
    fontSize: 16,
  },
  noMoreText: {
    textAlign: "center",
    color: "gray",
    paddingVertical: 10,
  },
});
