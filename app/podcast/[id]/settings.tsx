import { Pressable } from "@/components/Pressable";
import { Text } from "@/components/Text";
import { db } from "@/db/db";
import { episodes as episodesTable } from "@/db/schema";
import { useEpisodes } from "@/db/hooks/episodes";
import { and, eq, lt } from "drizzle-orm";
import { useGlobalSearchParams, useNavigation } from "expo-router";
import { useEffect, useState } from "react";
import { TextInput, View } from "react-native";
import * as Updates from "expo-updates";

function getId(id: string | string[]): number {
  if (typeof id === "string") return parseInt(id ?? 0);
  return parseInt(id[0] ?? 0);
}

export default function Settings() {
  const navigation = useNavigation();
  const [podcastNumber, setPodcastNumber] = useState("");
  const { id } = useGlobalSearchParams();
  const { data: episodes } = useEpisodes(getId(id));

  useEffect(() => {
    navigation.setOptions({
      title: "Settings",
      headerTitleStyle: { fontSize: 24 },
    });
  }, []);

  const onSave = async () => {
    const routeId = getId(id);
    const foundEpisode = episodes.find((episode) =>
      episode?.title?.startsWith(podcastNumber),
    );
    if (foundEpisode) {
      // query for all episodes made before the found episode
      // and update the dismissed field to true
      await db
        .update(episodesTable)
        .set({ dismissed: true })
        .where(
          and(
            lt(episodesTable.created, foundEpisode.created ?? 0),
            eq(episodesTable.podcastId, routeId),
          ),
        );
      console.log("episodes updated");
      await Updates.reloadAsync();
    }
  };

  return (
    <View className="flex-1 bg-slate-950 px-4">
      <Text className="px-0">
        Enter the podcast number you are caught up to
      </Text>
      <TextInput
        className="bg-slate-800 text-slate-200 text-xl p-2 z-0 rounded-xl mb-2"
        onChangeText={setPodcastNumber}
      />
      <Pressable
        onPress={onSave}
        className="bg-green-500 rounded-full p-2 items-center"
      >
        <Text type="subtitle">Save</Text>
      </Pressable>
    </View>
  );
}
