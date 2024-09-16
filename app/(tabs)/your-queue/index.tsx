import { View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePodcasts } from "@/db/hooks/podcasts";
import { Pressable } from "@/components/Pressable";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { fetchNewPodcasts } from "@/api/podcasts";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";
import { Fragment } from "react";
import { FlashList } from "@shopify/flash-list";
import TrackPlayer from "react-native-track-player";
import { convertItemsToTracks } from "@/services/audio/convertEpisodesToTracks";

export default function QueueScreen() {
  const { data: savedPodcasts } = usePodcasts();
  const { data: episodes } =
    useReverseChronologicalUnwatchedEpisodesWithPodcastInfo();

  const onRefresh = async () => {
    await fetchNewPodcasts(savedPodcasts);
  };

  const onPressItem = async (index: number) => {
    // create slice of the episodes array from the index to the end of the array
    const episodesSlice = episodes.slice(index);
    const tracks = convertItemsToTracks(episodesSlice);
    TrackPlayer.reset();
    TrackPlayer.add(tracks);
    const firstEpisode = episodesSlice[0];
    if (firstEpisode.episodes.progress) {
      TrackPlayer.seekTo(firstEpisode.episodes.progress);
    }
    TrackPlayer.play();
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
        renderItem={({ item, index }) => (
          <Fragment key={item.episodes.episodeId}>
            <Pressable
              onPress={() => onPressItem(index)}
              key={item.episodes.episodeId}
              className="bg-slate-800 rounded-xl m-4 p-4"
            >
              <View className="flex-1 ml-5">
                <Text type="title" className="pt-2 text-xl" numberOfLines={2}>
                  {item.episodes.title}
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
