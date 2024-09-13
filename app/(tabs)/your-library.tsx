import { Image, View } from "react-native";

import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { useMMKVString } from "react-native-mmkv";

export default function HomeScreen() {
  const [podcasts] = useMMKVString("podcasts");
  return (
    <SafeAreaView>
      <View className="flex-row items-center justify-center">
        <Text type="title">Your Library</Text>
      </View>
    </SafeAreaView>
  );
}
