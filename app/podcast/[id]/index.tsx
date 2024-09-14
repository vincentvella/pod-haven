import { Pressable } from "@/components/Pressable";
import { Text } from "@/components/Text";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { db } from "@/db/db";
import { useEpisodes } from "@/db/hooks/episodes";
import { podcasts } from "@/db/schema";
import { FlashList } from "@shopify/flash-list";
import { eq } from "drizzle-orm";
import { useLiveQuery } from "drizzle-orm/expo-sqlite";
import { Link, useGlobalSearchParams, useNavigation } from "expo-router";
import { Fragment, useEffect } from "react";
import { Image, View } from "react-native";

function getId(id: string | string[]): number {
  if (typeof id === "string") return parseInt(id ?? 0);
  return parseInt(id[0] ?? 0);
}

function stripHtml(htmlString: string): string {
  // Regular expression to match HTML tags
  const htmlTagPattern = /<\/?[^>]+>/gi;

  // Replace all HTML tags with an empty string
  const textContent = htmlString.replace(htmlTagPattern, "");

  return textContent;
}

export default function Podcast() {
  const navigation = useNavigation();
  const { id } = useGlobalSearchParams();
  const { data: episodes } = useEpisodes(getId(id));
  const { data: podcastData } = useLiveQuery(
    db
      .select()
      .from(podcasts)
      .where(eq(podcasts.id, getId(id))),
  );
  const podcast = podcastData[0];

  useEffect(() => {
    if (podcast) {
      navigation.setOptions({
        title: podcast.collectionName,
        headerTitleStyle: { fontSize: 14 },
        headerRight: () => (
          <Link href={`/podcast/${getId(id)}/settings`}>
            <TabBarIcon
              name="settings"
              color="white"
              style={{ alignSelf: "center" }}
            />
          </Link>
        ),
        headerLeft: () => null,
      });
    }
  }, [podcast]);

  if (!podcast) return null;

  return (
    <View className="flex-1 bg-slate-950">
      <FlashList
        estimatedItemSize={161}
        ListHeaderComponent={
          <View className="bg-gray-950 p-4">
            <Image
              source={{ uri: podcast.artworkUrl600 ?? "" }}
              className="w-40 h-40 self-center"
            />
            <Text type="title" className="self-center">
              {podcast.collectionName}
            </Text>
            <Text type="subtitle">{podcast.artistName}</Text>
          </View>
        }
        data={episodes}
        renderItem={({ item }) => {
          const convertedDescription = stripHtml(
            item.description ?? "<div></div>",
          );
          return (
            <Fragment key={item.episodeId}>
              <Pressable
                key={item.episodeId}
                className="bg-slate-800 rounded-xl m-2"
              >
                <View className="px-2">
                  <View className="flex-1 ml-2">
                    <Text
                      type="title"
                      className="text-xl py-1"
                      numberOfLines={2}
                    >
                      {item.title}
                    </Text>
                  </View>
                  <Text
                    type="body"
                    className="text-gray-500 text-sm px-2"
                    numberOfLines={2}
                  >
                    {convertedDescription}
                  </Text>
                  <Text className="px-2">
                    {new Date(item.created ?? 0).toLocaleDateString()} -{" "}
                    {item.itunes_duration}
                  </Text>
                  {/* Action Bar Row */}
                  {/* Should contain add to queue, download, and play button */}
                  <View className="flex-row items-center pb-2">
                    <Pressable>
                      <TabBarIcon
                        // TODO: add episode to queue - change to non-outlined version
                        name={
                          item.listened || item.dismissed
                            ? "add-circle-outline"
                            : "add-circle"
                        }
                        color="white"
                        style={{ alignSelf: "center" }}
                        size={30}
                      />
                    </Pressable>
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
                    <Pressable>
                      <TabBarIcon
                        name="play-circle-sharp"
                        color="white"
                        style={{
                          alignSelf: "center",
                        }}
                        size={30}
                      />
                    </Pressable>
                  </View>
                </View>
              </Pressable>
            </Fragment>
          );
        }}
        ListEmptyComponent={() => <Text>No results found</Text>}
      />
    </View>
  );
}
