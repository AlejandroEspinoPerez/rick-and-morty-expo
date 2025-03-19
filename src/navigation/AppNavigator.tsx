import React from "react";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator } from "@react-navigation/stack";
import { NavigationContainer } from "@react-navigation/native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context"; // Importar SafeAreaView
import HomeScreen from "../screens/HomeScreen";
import FavoritesScreen from "../screens/FavoritesScreen";
import { View, StyleSheet } from "react-native";
import LocationsScreen from "../screens/LocationsScreen"; 
import EpisodesScreen from "../screens/EpisodesScreen";
import LocationDetailsScreen from "../screens/LocationDetailsScreen";
import DetailsScreen from "../screens/DetailsScreen";
import EpisodeDetailsScreen from "../screens/EpisodeDetailsScreen"; 

const Tab = createBottomTabNavigator();

const Stack = createStackNavigator();

export type RootStackParamList = {
  Home: undefined;
  Details: { characterId: number };
};

// Navegación con `Stack` para los mundos
function LocationsStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Locations"
        component={LocationsScreen}
        options={{ title: "Mundos" }}
      />
      <Stack.Screen
        name="LocationDetails"
        component={LocationDetailsScreen}
        options={{ title: "Detalles del Mundo" }}
      />
    </Stack.Navigator>
  );
}

// 🔹 **Nuevo: Stack Navigator para los Episodios**
function EpisodesStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Episodes" component={EpisodesScreen} options={{ title: "Episodios" }} />
      <Stack.Screen name="EpisodeDetails" component={EpisodeDetailsScreen} options={{ title: "Detalles del Episodio" }} />
    </Stack.Navigator>
  );
}

// 🔹 **Nuevo: Stack Navigator para Personajes**
function HomeStackNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={HomeScreen}
        options={{ title: "Personajes de Rick & Morty" }}
      />
      <Stack.Screen
        name="Details"
        component={DetailsScreen}
        options={{ title: "Detalles del Personaje" }}
      />
    </Stack.Navigator>
  );
}

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <SafeAreaView style={styles.safeArea}>
        <Tab.Navigator
          screenOptions={({ route }) => ({
            tabBarIcon: ({ color, size }) => {
              let iconName;
              if (route.name === "Home") {
                iconName = "people-outline"; // Icono de personajes
              } else if (route.name === "Favorites") {
                iconName = "heart-outline"; // Icono de favoritos
              } else if (route.name === "Locations") {
                iconName = "earth-outline"; // Icono de mundos
              } else if (route.name === "Episodes") {
                iconName = "videocam-outline"; // Icono de episodios
              }
              return <Ionicons name={iconName} size={size} color={color} />;
            },
            tabBarActiveTintColor: "#FFD700",
            tabBarInactiveTintColor: "gray",
            headerShown: true, // Asegurar que el header se muestre
          })}
        >
          <Tab.Screen
            name="Home"
            component={HomeStackNavigator}
            options={{ title: "Personajes" }}
          />
          <Tab.Screen
            name="Locations"
            component={LocationsStackNavigator}
            options={{ title: "Mundos" }}
          />
          <Tab.Screen
            name="Episodes"
            component={EpisodesStackNavigator}
            options={{ title: "Episodios" }}
          />
          <Tab.Screen
            name="Favorites"
            component={FavoritesScreen}
            options={{ title: "Favoritos" }}
          />
        </Tab.Navigator>
      </SafeAreaView>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
});
