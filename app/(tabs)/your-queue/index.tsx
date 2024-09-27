import { View } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Pressable } from "@/components/Pressable";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";
import { Fragment } from "react";
import { FlashList } from "@shopify/flash-list";
import TrackPlayer from "react-native-track-player";
import {
  convertItemsToTracks,
  convertItunesDuraitonToSeconds,
} from "@/services/audio/convertEpisodesToTracks";
import { Image } from "@/components/Image";
import { stripHtml } from "@/utils/html";
import ProgressBar from "@/components/ProgressBar";
import DownloadButton from "@/components/DownloadButton";
import { RefreshButton } from "@/components/RefreshButton";

export default function QueueScreen() {
  const { data: episodes } =
    useReverseChronologicalUnwatchedEpisodesWithPodcastInfo();

  const onPressItem = async (index: number) => {
    // create slice of the episodes array from the index to the end of the array
    const episodesSlice = episodes.slice(index);
    const tracks = await convertItemsToTracks(episodesSlice);
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    const firstEpisode = episodesSlice[0];
    if (firstEpisode.episodes.progress) {
      await TrackPlayer.seekTo(firstEpisode.episodes.progress);
    }
    await TrackPlayer.play();
  };

  const { top } = useSafeAreaInsets();

  return (
    <View className={`flex-1 bg-slate-950`} style={{ paddingTop: top }}>
      <FlashList
        contentContainerStyle={{ paddingHorizontal: 7 }}
        estimatedItemSize={114}
        ListHeaderComponent={
          <>
            <View className="flex-row items-center justify-center">
              <Text type="title">Your Queue</Text>
            </View>
            {/* Add Refresh button for refreshing the queue */}
            <RefreshButton />
          </>
        }
        data={episodes}
        renderItem={({ item, index }) => (
          <Fragment key={item.episodes.episodeId}>
            <Pressable
              onPress={() => onPressItem(index)}
              key={item.episodes.episodeId}
              className="bg-slate-800 rounded-xl p-2"
            >
              <View className="flex-row">
                <Image
                  source={item.podcasts?.artworkUrl600 ?? ""}
                  className="w-12 h-12 rounded-xl self-center"
                  contentFit="cover"
                />
                <View className="flex-1 ml-2">
                  <Text
                    type="title"
                    className="p-0 text-md flex-1 ml-2"
                    numberOfLines={2}
                  >
                    {item.episodes.title}
                  </Text>
                  <Text
                    type="subtitle"
                    className="p-0 text-sm flex-1 ml-2 opacity-80"
                    numberOfLines={2}
                  >
                    {new Date(item.episodes.created ?? 0).toLocaleDateString()}
                  </Text>
                </View>
              </View>
              <Text
                type="title"
                className="pt-1 text-sm opacity-80"
                numberOfLines={2}
              >
                {item.podcasts?.artistName}
              </Text>
              <Text type="title" className="pt-1 text-sm" numberOfLines={2}>
                {stripHtml(item.episodes.description ?? "<div></div>")}
              </Text>
              <View className="flex-row items-center pb-2">
                <DownloadButton
                  id={item.episodes.id}
                  uri={item.episodes.enclosures?.[0]?.url ?? ""}
                />
                <View className="flex-1" />
              </View>
              {!!item.episodes.progress && (
                <ProgressBar
                  progress={item.episodes.progress}
                  duration={convertItunesDuraitonToSeconds(
                    item.episodes.itunes_duration ?? "00",
                  )}
                />
              )}
            </Pressable>
          </Fragment>
        )}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => <Text>No results found</Text>}
        ListFooterComponent={() => <View className="h-52" />}
      />
    </View>
  );
}
