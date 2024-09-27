import { View } from "react-native";
import { Pressable } from "./Pressable";
import { TabBarIcon } from "./navigation/TabBarIcon";
import { Text } from "./Text";
import { usePodcasts } from "@/db/hooks/podcasts";
import { useState } from "react";
import { podcasts } from "@/db/schema";
import { fetchNewPodcasts } from "@/api/podcasts";

export type Podcast = typeof podcasts.$inferSelect;

export function RefreshButton() {
  const { data: savedPodcasts } = usePodcasts();
  const [status, setStatus] = useState<
    "discovering" | "discovered" | "saving" | "idle"
  >("idle");
  const [currentPodcast, setCurrentPodcast] = useState<Podcast | null>();
  const [totalRefreshingPodcasts, setTotalRefreshingPodcasts] = useState(0);
  const [currentPodcastIndex, setCurrentPodcastIndex] = useState(0);
  const [foundEpisodes, setFoundEpisodes] = useState(0);
  const [downloadingEpisodes, setDownloadingEpisodes] = useState(0);
  const [error, setError] = useState<Error | null>(null);

  const onRefresh = async () => {
    try {
      await fetchNewPodcasts(
        savedPodcasts,
        (podcast, position, total) => {
          setStatus("discovering");
          setCurrentPodcast(podcast);
          setTotalRefreshingPodcasts(total);
          setCurrentPodcastIndex(position);
        },
        (episodesToDownload) => {
          setStatus("discovered");
          setFoundEpisodes(episodesToDownload);
        },
        (episodesToSave) => {
          setStatus("saving");
          setDownloadingEpisodes(episodesToSave);
        },
      );
      setCurrentPodcast(null);
      setTotalRefreshingPodcasts(0);
      setCurrentPodcastIndex(0);
      setDownloadingEpisodes(0);
      setStatus("idle");
    } catch (error) {
      if (error instanceof Error) {
        setStatus("idle");
        setError(error);
        console.error(error);
      }
    }
  };
  const progressString = `${currentPodcastIndex + 1}/${totalRefreshingPodcasts}`;
  return (
    <>
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
      {status === "discovering" && (
        <View className="flex-row items-center justify-center">
          <Text
            type="subtitle"
            className="text-md self-center dark:color-gray-500"
          >
            {progressString} {currentPodcast?.collectionName ?? ""}: Discovering
            episodes
          </Text>
        </View>
      )}
      {status === "discovered" && (
        <View className="flex-row items-center justify-center">
          <Text
            type="subtitle"
            className="text-md self-center dark:color-gray-500"
          >
            {progressString} {currentPodcast?.collectionName ?? ""}: Found{" "}
            {foundEpisodes} episodes
          </Text>
        </View>
      )}
      {status === "saving" && (
        <View className="flex-row items-center justify-center">
          <Text
            type="subtitle"
            className="text-md self-center dark:color-gray-500"
          >
            {progressString} {currentPodcast?.collectionName ?? ""}: Saving{" "}
            {downloadingEpisodes} episodes
          </Text>
        </View>
      )}
      {status === "idle" && (
        <View className="flex-row items-center justify-center h-9" />
      )}
      {error && (
        <View className="flex-row items-center justify-center">
          <Text
            type="subtitle"
            className="text-md self-center dark:color-red-500"
          >
            Error: {error.message}
          </Text>
        </View>
      )}
    </>
  );
}
