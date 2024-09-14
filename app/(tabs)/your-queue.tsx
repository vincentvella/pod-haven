import { View } from "react-native";
import { Text } from "@/components/Text";
import { SafeAreaView } from "react-native-safe-area-context";
import { usePodcasts } from "@/db/hooks/podcasts";
import { Pressable } from "@/components/Pressable";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { parse } from "rss-to-json";

type Entry = {
  id: string;
  title: string;
  description: string;
  link: string;
  published: number;
  created: number;
  category: unknown[];
  content: string;
  enclosures: {
    length: string;
    type: string;
    url: string;
  }[];
  content_encoded: string;
  itunes_duration: string;
  itunes_episode_type: string;
  media: {};
};

export default function QueueScreen() {
  const { data: savedPodcasts } = usePodcasts();

  const onRefresh = async () => {
    // fetch last 20 episodes for each podcast from its feedUrl
    const episodes = await Promise.all(
      savedPodcasts.map(async (podcast) => {
        if (!podcast.feedUrl) return [];
        const response = await parse(podcast.feedUrl);
        const data = response;
        console.log(Object.keys(data));
        const items: Entry[] = data.items.slice(0, 20);
        return { ...data, items };
      }),
    );
    console.log(JSON.stringify(episodes, null, 2));
    // TODO: Update the episodes in the database
  };

  return (
    <View className="flex-1 bg-slate-950">
      <SafeAreaView>
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
      </SafeAreaView>
    </View>
  );
}
