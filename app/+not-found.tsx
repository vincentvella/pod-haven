import { Link, Stack } from "expo-router";
import { StyleSheet, View } from "react-native";

import { Text } from "@/components/Text";

export default function NotFoundScreen() {
  return (
    <>
      <Stack.Screen options={{ title: "Oops!" }} />
      <View className="flex-1 bg-slate-950 items-center justify-center p-5">
        <Text type="title">This screen doesn't exist.</Text>
        <Link href="/(tabs)/your-queue" style={styles.link}>
          <Text type="subtitle">Go to home screen!</Text>
        </Link>
      </View>
    </>
  );
}

const styles = StyleSheet.create({
  link: {
    marginTop: 15,
    paddingVertical: 15,
  },
});
