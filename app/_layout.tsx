import "../services/audio/registerTrackPlayer";
import {
  DarkTheme,
  DefaultTheme,
  ThemeProvider,
} from "@react-navigation/native";
import { useFonts } from "expo-font";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import migrations from "../drizzle/migrations";
import { useMigrations } from "drizzle-orm/expo-sqlite/migrator";
// import { useDrizzleStudio } from "expo-drizzle-studio-plugin";
import { useColorScheme } from "@/services/theme/useColorScheme";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { db, expoDb } from "@/db/db";
import useSetupTrackPlayer from "@/services/audio/useSetupTrackPlayer";

import "react-native-reanimated";
import "../global.css";

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

  // useDrizzleStudio(expoDb);

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
