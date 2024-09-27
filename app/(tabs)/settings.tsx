import { Text } from "@/components/Text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Updates from "@/services/updates/Updates";
import { Pressable } from "@/components/Pressable";
import { episodes, podcasts } from "@/db/schema";
import { db } from "@/db/db";
import { reloadAsync } from "expo-updates";

export default function Settings() {
  const resetDb = async () => {
    await db.delete(podcasts);
    await db.delete(episodes);
    reloadAsync();
  };

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView>
        <Text type="title" className="p-4">
          Settings
        </Text>
        <Updates />
        <Pressable
          onPress={() => resetDb()}
          className="bg-green-500 rounded-full p-2 mx-12 items-center"
        >
          <Text className="dark:color-black font-bold">Reset DB</Text>
        </Pressable>
      </SafeAreaView>
    </View>
  );
}
