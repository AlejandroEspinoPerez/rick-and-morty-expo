import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function LocationsScreen() {
  const [locations, setLocations] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/location")
      .then((res) => res.json())
      .then((data) => setLocations(data.results));
  }, []);

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
});
