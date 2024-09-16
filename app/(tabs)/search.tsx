import { ActivityIndicator, Image, TextInput, View } from "react-native";
import { db } from "@/db/db";
import { podcasts as podcastTable } from "@/db/schema";

export type Podcast = typeof podcasts.$inferSelect;

import { Text } from "@/components/Text";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Fragment, useState } from "react";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Pressable } from "@/components/Pressable";
import { podcasts } from "@/db/schema";
import { eq } from "drizzle-orm";
import { usePodcasts } from "@/db/hooks/podcasts";
import { FlashList } from "@shopify/flash-list";

export default function SearchScreen() {
  const [settingPodcast, setSettingPodcast] = useState<Podcast>();
  const [input, setInput] = useState("");
  const [searched, setSearched] = useState(false);
  const [resultCount, setResultCount] = useState(0);
  const [podcasts, setPodcasts] = useState<Podcast[]>([]);
  const { data: savedPodcasts } = usePodcasts();

  const search = async () => {
    const uri = `https://itunes.apple.com/search?term=${input}&entity=podcast`;
    const response = await fetch(uri);
    const data = await response.json();
    setSearched(true);
    setResultCount(data.resultCount);
    // Filter any duplicate podcasts by checking if the feedUrl is duplicated
    // and if it is, remove the duplicate
    const uniquePodcasts = (data.results as Podcast[]).filter(
      (podcast, index, self) =>
        index === self.findIndex((t) => t.feedUrl === podcast.feedUrl),
    );
    setPodcasts(uniquePodcasts);
  };

  const addPodcastToLibrary = async (podcast: Podcast) => {
    setSettingPodcast(podcast);
    await db.insert(podcastTable).values(podcast);
    setSettingPodcast(undefined);
  };

  const removePodcastFromLibrary = async (podcast: Podcast) => {
    await db
      .delete(podcastTable)
      .where(eq(podcastTable.feedUrl, podcast.feedUrl ?? ""));
  };

  const { top } = useSafeAreaInsets();

  return (
    <View className={`flex-1 bg-slate-950`} style={{ paddingTop: top }}>
      <View className="bg-gray-950 p-2">
        <Text type="title">Search</Text>
        <View className="h-16">
          <View className="flex-row">
            <View className="bg-slate-200 rounded-l-xl p-4">
              <TabBarIcon name="search" style={{ alignSelf: "center" }} />
            </View>
            <TextInput
              placeholder="Search"
              className="flex-1 bg-slate-200 text-slate-800 text-4xl py-4 z-0 rounded-r-xl pr-20"
              onChangeText={setInput}
            />
          </View>
          <Pressable
            onPress={search}
            activeScale={0.9}
            className="w-20 h-16 bg-green-500 rounded-r-xl p-4 position-absolute -top-16 self-end"
          >
            <TabBarIcon
              name="checkmark-sharp"
              style={{ alignSelf: "center" }}
            />
          </Pressable>
        </View>
        {searched && resultCount !== 0 && (
          <View className="flex-row">
            <View className="pb-2">
              <Text>Showing {resultCount} results</Text>
            </View>
          </View>
        )}
      </View>
      <FlashList
        estimatedItemSize={114}
        contentContainerStyle={{ paddingHorizontal: 7 }}
        keyExtractor={(item) => item.feedUrl ?? ""}
        data={podcasts}
        renderItem={({ item }) => {
          const isSaved = savedPodcasts.find(
            (podcast) => podcast.feedUrl === item.feedUrl,
          );
          return (
            <Fragment>
              <Pressable
                key={item.feedUrl}
                className="bg-slate-800 rounded-xl p-4"
              >
                <View className="flex-row">
                  {item.artworkUrl60 && (
                    <Image
                      source={{ uri: item.artworkUrl60 }}
                      className="w-20 h-20 rounded-xl"
                    />
                  )}
                  <View className="flex-1 ml-5">
                    <Text
                      type="title"
                      className="pt-2 text-2xl"
                      numberOfLines={2}
                    >
                      {item.collectionName}
                    </Text>
                  </View>
                </View>
                <Text type="subtitle" className="mt-2" numberOfLines={2}>
                  {item.feedUrl}
                </Text>
                <Pressable
                  disabled={settingPodcast === item}
                  hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                  onPress={() => {
                    isSaved
                      ? removePodcastFromLibrary(item)
                      : addPodcastToLibrary(item);
                  }}
                  className="bg-green-500 rounded-full p-4 self-end"
                >
                  {!!isSaved && (
                    <TabBarIcon
                      name="checkmark-sharp"
                      style={{ alignSelf: "center" }}
                    />
                  )}
                  {!isSaved &&
                    (settingPodcast === item ? (
                      <ActivityIndicator color="black" />
                    ) : (
                      <TabBarIcon name="add" style={{ alignSelf: "center" }} />
                    ))}
                </Pressable>
              </Pressable>
            </Fragment>
          );
        }}
        ItemSeparatorComponent={() => <View className="h-2" />}
        ListEmptyComponent={() => <Text>No results found</Text>}
      />
    </View>
  );
}
