import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  StyleSheet,
} from "react-native";
import { useNavigation } from "@react-navigation/native";

export default function EpisodesScreen() {
  const [episodes, setEpisodes] = useState([]);
  const navigation = useNavigation();

  useEffect(() => {
    fetch("https://rickandmortyapi.com/api/episode")
      .then((res) => res.json())
      .then((data) => setEpisodes(data.results));
  }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={episodes}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.episodeCard}
            onPress={() =>
              navigation.navigate("EpisodeDetails", { episodeId: item.id })
            }
          >
            <Text style={styles.title}>{item.name}</Text>
            <Text style={styles.subtitle}>📅 {item.air_date}</Text>
            <Text style={styles.subtitle}>🎬 {item.episode}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: "#0F2027", padding: 10 },
  episodeCard: {
    backgroundColor: "rgba(255, 255, 255, 0.1)",
    padding: 15,
    marginVertical: 8,
    borderRadius: 10,
  },
  title: { fontSize: 20, fontWeight: "bold", color: "#FFF" },
  subtitle: { fontSize: 16, color: "#DDD" },
});
