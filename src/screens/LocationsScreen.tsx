import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LocationsScreen() {
  const [locations, setLocations] = useState([]);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [nextPage, setNextPage] = useState<number | null>(1);
  const navigation = useNavigation();

  useEffect(() => {
    loadLocations();
  }, []);

  const loadLocations = async () => {
    if (!nextPage) return;

    if (page === 1) setLoading(true);
    else setLoadingMore(true);

    try {
      const res = await fetch(
        `https://rickandmortyapi.com/api/location?page=${page}`
      );
      const data = await res.json();

      setLocations((prevLocations) => [...prevLocations, ...data.results]); // Concatenamos mundos
      setNextPage(data.info.next ? page + 1 : null); // Si hay más páginas, actualizamos el número
      setPage((prevPage) => prevPage + 1);
    } catch (error) {
      console.error("Error cargando mundos:", error);
    }

    setLoading(false);
    setLoadingMore(false);
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
        data={locations}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.locationCard}
            onPress={() =>
              navigation.navigate("LocationDetails", { locationId: item.id })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>🪐 Tipo: {item.type}</Text>
            <Text style={styles.subtitle}>🌌 Dimensión: {item.dimension}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        ListFooterComponent={
          nextPage ? (
            <TouchableOpacity
              style={styles.loadMoreButton}
              onPress={loadLocations}
            >
              {loadingMore ? (
                <ActivityIndicator size="small" color="#FFF" />
              ) : (
                <Text style={styles.loadMoreText}>Cargar Más</Text>
              )}
            </TouchableOpacity>
          ) : (
            <Text style={styles.noMoreText}>No hay más mundos</Text>
          )
        }
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2027", padding: 10 },
  locationCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  subtitle: { fontSize: 16, color: "#DDD" },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  loadMoreButton: {
    backgroundColor: "#00B5CC",
    padding: 15,
    marginVertical: 20,
    borderRadius: 10,
    alignItems: "center",
    alignSelf: "center",
    width: 180,
    elevation: 3,
  },
  loadMoreText: {
    color: "#FFF",
    fontSize: 18,
    fontWeight: "bold",
  },
  noMoreText: {
    textAlign: "center",
    color: "#DDD",
    paddingVertical: 10,
    fontSize: 16,
  },
});
