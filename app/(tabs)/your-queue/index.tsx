import { View, useWindowDimensions } from "react-native";
import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { usePodcasts } from "@/db/hooks/podcasts";
import { Pressable } from "@/components/Pressable";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { fetchNewPodcasts } from "@/api/podcasts";
import { useReverseChronologicalUnwatchedEpisodesWithPodcastInfo } from "@/db/hooks/episodes";
import { Fragment, useEffect, useRef } from "react";
import { FlashList } from "@shopify/flash-list";
import TrackPlayer from "react-native-track-player";
import {
  convertItemsToTracks,
  convertItunesDuraitonToSeconds,
} from "@/services/audio/convertEpisodesToTracks";
import { Image } from "@/components/Image";
import { stripHtml } from "@/utils/html";
import Slider, { ISlider } from "rn-video-slider";
import ProgressBar from "@/components/ProgressBar";

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
    await TrackPlayer.reset();
    await TrackPlayer.add(tracks);
    const firstEpisode = episodesSlice[0];
    if (firstEpisode.episodes.progress) {
      await TrackPlayer.seekTo(firstEpisode.episodes.progress);
    }
    await TrackPlayer.play();
  };

  const { top } = useSafeAreaInsets();
  const { width } = useWindowDimensions();

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
            <Pressable
              className="bg-green-500 rounded-full p-2 mx-12 items-center mb-2"
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
                <Pressable>
                  <TabBarIcon
                    // TODO: download episode - change to non-outlined version
                    name="download-outline"
                    color="white"
                    size={30}
                    style={{
                      alignSelf: "center",
                    }}
                  />
                </Pressable>
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
