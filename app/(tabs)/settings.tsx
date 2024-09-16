import { Text } from "@/components/Text";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Updates from "@/services/updates/Updates";

export default function Settings() {
  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView>
        <Text type="title" className="p-4">
          Settings
        </Text>
        <Updates />
      </SafeAreaView>
    </View>
  );
}
