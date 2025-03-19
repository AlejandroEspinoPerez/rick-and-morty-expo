import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { RouteProp } from "@react-navigation/native";
import { StackNavigationProp } from "@react-navigation/stack";
import { RootStackParamList } from "../navigation/AppNavigator";
import { fetchCharacterDetails } from "../services/rickAndMortyService";

type DetailsScreenRouteProp = RouteProp<RootStackParamList, "Details">;
type DetailsScreenNavigationProp = StackNavigationProp<
  RootStackParamList,
  "Details"
>;

type Props = {
  route: DetailsScreenRouteProp;
  navigation: DetailsScreenNavigationProp;
};

export default function DetailsScreen({ route }: Props) {
  const { characterId } = route.params;
  const [character, setCharacter] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchCharacterDetails(characterId)
      .then((data) => {
        setCharacter(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching character details:", error);
        setLoading(false);
      });
  }, [characterId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B5CC" />
      </View>
    );
  }

  if (!character) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          No se pudo cargar la información del personaje.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      {/* Fondo con degradado */}
      <LinearGradient
        colors={["#0F2027", "#203A43", "#2C5364"]}
        style={styles.background}
      />

      {/* Imagen del personaje */}
      <View style={styles.imageContainer}>
        <Image source={{ uri: character.image }} style={styles.poster} />
      </View>

      {/* Información Principal */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{character.name}</Text>
        {character.type ? (
          <Text style={styles.subtitle}>🛸 Tipo: {character.type}</Text>
        ) : null}
        <Text style={styles.subtitle}>🧬 Especie: {character.species}</Text>
        <Text style={styles.subtitle}>🚻 Género: {character.gender}</Text>
        <Text style={styles.subtitle}>❤️ Estado: {character.status}</Text>
        <Text style={styles.subtitle}>🌍 Origen: {character.origin.name}</Text>
        <Text style={styles.subtitle}>
          📍 Ubicación actual: {character.location.name}
        </Text>
      </View>

      {/* Lista de episodios */}
      <View style={styles.episodeContainer}>
        <Text style={styles.sectionTitle}>📺 Aparece en estos episodios:</Text>
        {character.episodes.length > 0 ? (
          character.episodes.map((ep: any, index: number) => (
            <Text key={index} style={styles.episodeText}>
              🎬 {ep.episode} - {ep.name} ({ep.air_date})
            </Text>
          ))
        ) : (
          <Text style={styles.noEpisodesText}>
            No hay episodios disponibles.
          </Text>
        )}
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#0F2027", // Fondo oscuro para un estilo más moderno
  },
  background: {
    position: "absolute",
    width: "100%",
    height: "100%",
  },
  imageContainer: {
    alignItems: "center",
    marginTop: 20,
  },
  poster: {
    width: 200,
    height: 200,
    borderRadius: 100,
    borderWidth: 4,
    borderColor: "#00B5CC",
  },
  detailsContainer: {
    marginTop: 20,
    backgroundColor: "rgba(255, 255, 255, 0.1)", // Transparencia para efecto moderno
    padding: 20,
    borderRadius: 15,
    marginHorizontal: 20,
    shadowColor: "#000",
    shadowOpacity: 0.3,
    shadowOffset: { width: 0, height: 4 },
    shadowRadius: 6,
  },
  title: {
    fontSize: 30,
    fontWeight: "bold",
    color: "#FFF",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#EEE",
    marginBottom: 5,
    textAlign: "center",
  },
  episodeContainer: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    marginTop: 20,
    borderRadius: 10,
    marginHorizontal: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#FFF",
    textAlign: "center",
  },
  episodeText: {
    fontSize: 16,
    color: "#DDD",
    marginBottom: 5,
  },
  noEpisodesText: {
    fontSize: 16,
    color: "gray",
    textAlign: "center",
  },
  centered: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorText: {
    fontSize: 18,
    color: "red",
    textAlign: "center",
  },
});
