import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  Image,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function FavoritesScreen() {
  const [favorites, setFavorites] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadFavorites();
  }, []);

  const loadFavorites = async () => {
    try {
      const favs = await AsyncStorage.getItem("favorites");
      if (favs) {
        const parsedFavs = JSON.parse(favs);
        if (Array.isArray(parsedFavs)) {
          setFavorites(parsedFavs);
        } else {
          setFavorites([]); // Evitar error si el formato no es correcto
        }
      } else {
        setFavorites([]);
      }
    } catch (error) {
      console.error("Error loading favorites:", error);
      setFavorites([]);
    }
    setLoading(false);
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
      <Text style={styles.title}>⭐ Tus Favoritos</Text>
      {favorites.length === 0 ? (
        <Text style={styles.emptyText}>No tienes personajes favoritos.</Text>
      ) : (
        <FlatList
          data={favorites}
          renderItem={({ item }) =>
            item && item.id ? ( // Verificar que el item y su ID existan
              <View style={styles.card}>
                <Image source={{ uri: item.image }} style={styles.image} />
                <Text style={styles.name}>{item.name}</Text>
              </View>
            ) : null
          }
          keyExtractor={(item) =>
            item?.id ? item.id.toString() : Math.random().toString()
          } // Evitar error si item.id es undefined
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2027", padding: 10 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  emptyText: {
    fontSize: 18,
    color: "gray",
    textAlign: "center",
    marginTop: 20,
  },
  card: {
    flexDirection: "row",
    backgroundColor: "#203A43",
    padding: 15,
    borderRadius: 10,
    marginVertical: 5,
  },
  image: { width: 80, height: 80, borderRadius: 10 },
  name: { fontSize: 18, color: "#FFF", marginLeft: 10 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
});
