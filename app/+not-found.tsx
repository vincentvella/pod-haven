import { Link, Stack } from "expo-router";
import { StyleSheet } from "react-native";

import { ThemedView } from "@/components/ThemedView";
import { Text } from "@/components/Text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <ThemedView style={styles.container}>
        <Text type="title">This screen doesn't exist.</Text>
        <Link href="/(tabs)/your-queue" style={styles.link}>
          <Text type="subtitle">Go to home screen!</Text>
        </Link>
      </ThemedView>
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
  },
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
