import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  Image,
  ActivityIndicator,
  TextInput,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { LinearGradient } from "expo-linear-gradient";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchCharacters } from "../services/rickAndMortyService";

type HomeScreenNavigationProp = StackNavigationProp<RootStackParamList, "Home">;

type Props = {
  navigation: HomeScreenNavigationProp;
};

export default function HomeScreen({ navigation }: Props) {
  const [characters, setCharacters] = useState<any[]>([]);
  const [favorites, setFavorites] = useState<number[]>([]);
    const [searchQuery, setSearchQuery] = useState("");
    const [page, setPage] = useState(1);
    const [loading, setLoading] = useState(true);
    const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);

  useEffect(() => {
    loadCharacters();
    loadFavorites();
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

  const loadFavorites = async () => {
    const favs = await AsyncStorage.getItem("favorites");
    if (favs) {
      setFavorites(JSON.parse(favs));
    }
  };

  const toggleFavorite = async (characterId: number) => {
    let updatedFavorites = [...favorites];

    if (updatedFavorites.includes(characterId)) {
      updatedFavorites = updatedFavorites.filter((id) => id !== characterId);
    } else {
      updatedFavorites.push(characterId);
    }

    setFavorites(updatedFavorites);
    await AsyncStorage.setItem("favorites", JSON.stringify(updatedFavorites));
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
  };

  const filteredCharacters = characters.filter((char) =>
    char.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B5CC" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={styles.background}
      />

      <TextInput
        style={styles.searchBar}
        placeholder="🔍 Buscar personaje..."
        placeholderTextColor="#AAA"
        value={searchQuery}
        onChangeText={handleSearch}
      />

      <FlatList
        data={filteredCharacters}
        contentContainerStyle={styles.listContent}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <TouchableOpacity
              style={styles.imageContainer}
              onPress={() =>
                navigation.navigate("Details", { characterId: item.id })
              }
            >
              <Image source={{ uri: item.image }} style={styles.image} />
            </TouchableOpacity>
            <View style={styles.textContainer}>
              <Text style={styles.title}>{item.name}</Text>
              <Text style={styles.subtitle}>Especie: {item.species}</Text>
              <Text style={styles.subtitle}>Estado: {item.status}</Text>
            </View>
            <TouchableOpacity onPress={() => toggleFavorite(item.id)}>
              <Text
                style={[
                  styles.favoriteIcon,
                  favorites.includes(item.id) && styles.favorited,
                ]}
              >
                {favorites.includes(item.id) ? "⭐" : "☆"}
              </Text>
            </TouchableOpacity>
          </View>
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
  container: { flex: 1 },
  background: { position: "absolute", width: "100%", height: "100%" },
  searchBar: {
    backgroundColor: "rgba(255, 255, 255, 0.2)",
    borderRadius: 20,
    paddingHorizontal: 15,
    paddingVertical: 10,
    margin: 15,
    color: "#FFF",
    fontSize: 16,
  },
  listContent: { paddingHorizontal: 10, paddingBottom: 20 },
  card: {
    flexDirection: "row",
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
    alignItems: "center",
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 5,
  },
  imageContainer: { flex: 1 },
  image: {
    width: 80,
    height: 80,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00B5CC",
  },
  textContainer: { marginLeft: 15, flex: 1 },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  subtitle: { fontSize: 16, color: "#DDD" },
  favoriteIcon: { fontSize: 24, color: "#AAA", paddingHorizontal: 10 },
  favorited: { color: "#FFD700" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
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
