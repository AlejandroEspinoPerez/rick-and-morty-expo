import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
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
      {/* Imagen del personaje */}
      <Image source={{ uri: character.image }} style={styles.poster} />

      {/* Información Principal */}
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{character.name}</Text>
        {character.type ? (
          <Text style={styles.subtitle}>Tipo: {character.type}</Text>
        ) : null}
        <Text style={styles.subtitle}>Especie: {character.species}</Text>
        <Text style={styles.subtitle}>Género: {character.gender}</Text>
        <Text style={styles.subtitle}>Estado: {character.status}</Text>
        <Text style={styles.subtitle}>Origen: {character.origin.name}</Text>
        <Text style={styles.subtitle}>
          Ubicación actual: {character.location.name}
        </Text>
      </View>

      {/* Lista de episodios */}
      <View style={styles.episodeContainer}>
        <Text style={styles.sectionTitle}>Aparece en estos episodios:</Text>
        {character.episodes.length > 0 ? (
          character.episodes.map((ep: any, index: number) => (
            <Text key={index} style={styles.episodeText}>
              {ep.episode} - {ep.name} ({ep.air_date})
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
    backgroundColor: "#fff",
  },
  poster: {
    width: "100%",
    height: 400,
    resizeMode: "cover",
  },
  detailsContainer: {
    padding: 15,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 18,
    color: "#555",
    marginBottom: 5,
    textAlign: "center",
  },
  episodeContainer: {
    padding: 15,
    marginTop: 20,
    backgroundColor: "#f8f8f8",
    borderRadius: 10,
    marginHorizontal: 10,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
    color: "#333",
  },
  episodeText: {
    fontSize: 16,
    color: "#666",
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
