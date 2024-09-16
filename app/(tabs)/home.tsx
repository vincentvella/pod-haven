import { Image } from "react-native";
import { View } from "react-native";
import { usePodcasts } from "@/db/hooks/podcasts";
import { Text } from "@/components/Text";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Pressable } from "@/components/Pressable";
import { Fragment } from "react";
import { router } from "expo-router";
import { FlashList } from "@shopify/flash-list";
import { useSafeAreaInsets } from "react-native-safe-area-context";

export default function HomeScreen() {
  const { top } = useSafeAreaInsets();
  const { data: savedPodcasts } = usePodcasts();
  return (
    <View className="flex-1 bg-slate-950" style={{ paddingTop: top }}>
      <FlashList
        keyExtractor={(item) => item.feedUrl ?? ""}
        estimatedItemSize={113}
        data={savedPodcasts}
        ListHeaderComponent={
          <View className="bg-gray-950 px-4">
            <Text type="title">Your Library</Text>
          </View>
        }
        renderItem={({ item }) => (
          <Fragment key={item.feedUrl}>
            <Pressable
              key={item.feedUrl}
              className="bg-slate-800 rounded-xl m-4 p-4"
              onPress={() => router.navigate(`/podcast/${item.id}`)}
            >
              <View className="flex-row">
                {item.artworkUrl60 && (
                  <Image
                    source={{ uri: item.artworkUrl600 ?? "" }}
                    className="w-20 h-20 rounded-xl"
                  />
                )}
                <View className="flex-1 ml-5">
                  <Text type="title" className="pt-2 text-xl" numberOfLines={2}>
                    {item.collectionName}
                  </Text>
                </View>
                {/* Add chevron icon to show more info */}
                <TabBarIcon
                  name="caret-forward-sharp"
                  color="white"
                  style={{ alignSelf: "center", padding: 4 }}
                />
              </View>
            </Pressable>
          </Fragment>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => <Text>No results found</Text>}
      />
    </View>
  );
}
