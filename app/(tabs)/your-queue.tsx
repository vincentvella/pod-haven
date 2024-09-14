import { View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { episodes as episodesTable } from "@/db/schema";
import { usePodcasts } from "@/db/hooks/podcasts";
import { Pressable } from "@/components/Pressable";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { fetchNewPodcasts } from "@/api/podcasts";
import { useReverseChronologicalUnwatchedEpisodes } from "@/db/hooks/episodes";
import { Fragment } from "react";
import { FlashList } from "@shopify/flash-list";

export type Episode = typeof episodesTable.$inferSelect;

export default function QueueScreen() {
  const { data: savedPodcasts } = usePodcasts();
  const { data: episodes } = useReverseChronologicalUnwatchedEpisodes();

  const onRefresh = async () => {
    await fetchNewPodcasts(savedPodcasts);
  };

  const { top } = useSafeAreaInsets();

  return (
    <View className={`flex-1 bg-slate-950`} style={{ paddingTop: top }}>
      <FlashList
        estimatedItemSize={114}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-center">
              <Text type="title">Your Queue</Text>
            </View>
            {/* Add Refresh button for refreshing the queue */}
            <Pressable
              className="bg-green-500 rounded-full p-2 mx-12 items-center"
              onPress={onRefresh}
            >
              <View className="flex-row justify-center items-center">
                <TabBarIcon
                  name="refresh"
                  style={{ alignSelf: "center" }}
                  size={18}
                />
                <Text
                  type="subtitle"
                  className="text-xl self-center dark:color-black"
                >
                  Refresh
                </Text>
              </View>
            </Pressable>
          </>
        }
        data={episodes}
        renderItem={({ item }) => (
          <Fragment key={item.episodeId}>
            <Pressable
              key={item.episodeId}
              className="bg-slate-800 rounded-xl m-4 p-4"
            >
              <View className="flex-1 ml-5">
                <Text type="title" className="pt-2 text-xl" numberOfLines={2}>
                  {item.title}
                </Text>
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
