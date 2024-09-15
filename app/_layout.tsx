import "../services/audio/register-track-player";
import "expo-dev-client";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack, router } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import migrations from "../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
import { useDrizzleStudio } from "expo-drizzle-studio-plugin";

global.Buffer = require("buffer").Buffer;

import "react-native-reanimated";
import "../global.css";

import { useColorScheme } from "@/services/theme/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { db, expoDb } from "@/db/db";
import useSetupTrackPlayer from "@/services/audio/useSetupTrackPlayer";
import { View } from "react-native";
import { Text } from "@/components/Text";
import TrackPlayer from "react-native-track-player";
import TrackPlayerStatusBar from "@/services/audio/TrackPlayerStatusBar";

export const unstable_settings = {
  initialRouteName: "(tabs)/your-library",
};

// Prevent the splash screen from auto-hiding before asset loading is complete.
SplashScreen.preventAutoHideAsync();

export default function RootLayout() {
  const { success, error } = useMigrations(db, migrations);
  const initializedTrackPlayer = useSetupTrackPlayer();
  useEffect(() => {
    if (error) {
      console.error(error);
    }
  }, [error]);

  useDrizzleStudio(expoDb);

  const colorScheme = useColorScheme();
  const [loaded] = useFonts({
    SpaceMono: require("../assets/fonts/SpaceMono-Regular.ttf"),
  });

  useEffect(() => {
    if (loaded && success && initializedTrackPlayer) {
      SplashScreen.hideAsync();
    }
  }, [loaded, success, initializedTrackPlayer]);

  if (!loaded || !success || !initializedTrackPlayer) {
    return null;
  }

  return (
    <GestureHandlerRootView>
      <ThemeProvider value={colorScheme === "dark" ? DarkTheme : DefaultTheme}>
        <Stack initialRouteName="(tabs)/your-library">
          <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
          <Stack.Screen
            name="podcast/[id]/index"
            options={{
              title: "",
              headerBackTitleVisible: false,
              headerTintColor: "#fff",
            }}
          />
          <Stack.Screen
            name="podcast/[id]/settings"
            options={{ title: "", presentation: "modal", headerBackTitle: "" }}
          />
          <Stack.Screen name="+not-found" />
        </Stack>
      </ThemeProvider>
    </GestureHandlerRootView>
  );
}
