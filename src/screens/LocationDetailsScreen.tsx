import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ActivityIndicator,
  ScrollView,
} from "react-native";

export default function LocationDetailsScreen({ route }: any) {
  const { locationId } = route.params;
  const [location, setLocation] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`https://rickandmortyapi.com/api/location/${locationId}`)
      .then((res) => res.json())
      .then((data) => {
        setLocation(data);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching location details:", error);
        setLoading(false);
      });
  }, [locationId]);

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#00B5CC" />
      </View>
    );
  }

  if (!location) {
    return (
      <View style={styles.centered}>
        <Text style={styles.errorText}>
          No se pudo cargar la información del mundo.
        </Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.detailsContainer}>
        <Text style={styles.title}>{location.name}</Text>
        <Text style={styles.subtitle}>🪐 Tipo: {location.type}</Text>
        <Text style={styles.subtitle}>🌌 Dimensión: {location.dimension}</Text>
        <Text style={styles.subtitle}>
          👥 Número de residentes: {location.residents.length}
        </Text>
      </View>
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
  subtitle: { fontSize: 18, color: "#DDD", marginBottom: 5 },
  centered: { flex: 1, justifyContent: "center", alignItems: "center" },
  errorText: { fontSize: 18, color: "red", textAlign: "center" },
});
