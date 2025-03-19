import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
  Image,
  FlatList,
} from "react-native";

export default function EpisodeDetailsScreen({ route }: any) {
  const { episodeId } = route.params;
  const [episode, setEpisode] = useState<any>(null);
  const [characters, setCharacters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchEpisodeDetails() {
      try {
        const res = await fetch(
          `https://rickandmortyapi.com/api/episode/${episodeId}`
        );
        const data = await res.json();
        setEpisode(data);

        // Extraer los IDs de los personajes de las URLs
        const characterIds = data.characters.map((url: string) =>
          url.split("/").pop()
        );

        // Hacer una sola petición para todos los personajes
        if (characterIds.length) {
          const characterRes = await fetch(
            `https://rickandmortyapi.com/api/character/${characterIds.join(
              ","
            )}`
          );
          const characterData = await characterRes.json();
          setCharacters(
            Array.isArray(characterData) ? characterData : [characterData]
          );
        }

        setLoading(false);
      } catch (error) {
        console.error("Error fetching episode details:", error);
        setLoading(false);
      }
    }

    fetchEpisodeDetails();
  }, [episodeId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B5CC" />
      </View>
    );
  }

  if (!episode) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          No se pudo cargar la información del episodio.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{episode.name}</Text>
        <Text style={styles.subtitle}>
          📅 Fecha de emisión: {episode.air_date}
        </Text>
        <Text style={styles.subtitle}>
          🎬 Código del episodio: {episode.episode}
        </Text>
      </View>

      {/* Lista de personajes */}
      <Text style={styles.sectionTitle}>👥 Personajes en este episodio:</Text>
      <FlatList
        data={characters}
        keyExtractor={(item) => item.id.toString()}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.characterList}
        renderItem={({ item }) => (
          <View style={styles.characterCard}>
            <Image source={{ uri: item.image }} style={styles.characterImage} />
            <Text style={styles.characterName}>{item.name}</Text>
            <Text style={styles.characterStatus}>🟢 {item.status}</Text>
          </View>
        )}
      />
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2027" },
  detailsContainer: { padding: 20 },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 18,
    color: "#DDD",
    marginBottom: 5,
    textAlign: "center",
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFD700",
    textAlign: "center",
    marginVertical: 10,
  },
  characterList: {
    paddingHorizontal: 10,
    paddingBottom: 20,
  },
  characterCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    marginHorizontal: 8,
    width: 120,
  },
  characterImage: {
    width: 100,
    height: 100,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "#00B5CC",
  },
  characterName: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#FFF",
    textAlign: "center",
    marginTop: 5,
  },
  characterStatus: {
    fontSize: 12,
    color: "#DDD",
    textAlign: "center",
  },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
});
