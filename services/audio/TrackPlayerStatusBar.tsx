import BottomSheet from "@gorhom/bottom-sheet";
import { Pressable } from "@/components/Pressable";
import { Text } from "@/components/Text";
import { TabBarIcon } from "@/components/navigation/TabBarIcon";
import { Platform, View, useWindowDimensions } from "react-native";
import TrackPlayer, {
  useActiveTrack,
  useProgress,
  useIsPlaying,
} from "react-native-track-player";
import Slider, { ISlider } from "rn-video-slider";
import { useEffect, useRef } from "react";

function formatPlaybackTime(seconds: number) {
  const hours = Math.floor(seconds / 3600);
  const minutes = Math.floor((seconds - hours * 3600) / 60);
  const secondsLeft = seconds - hours * 3600 - minutes * 60;
  // only show hours if there are greater than 60 minutes
  return hours > 0
    ? `${hours}:${minutes < 10 ? "0" : ""}${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`
    : `${minutes < 10 ? "0" : ""}${minutes}:${secondsLeft < 10 ? "0" : ""}${secondsLeft}`;
}

function AudioSeeker() {
  const seeking = useRef(false);
  const ref = useRef<ISlider>(null);
  const progress = useProgress();

  useEffect(() => {
    if (ref.current) {
      const progressBarProgress =
        Math.floor(Math.min(progress.position, progress.duration)) /
        Math.floor(progress.duration);
      const bufferProgress =
        Math.floor(progress.buffered) / Math.floor(progress.duration);
      if (typeof progressBarProgress === "number") {
        if (!seeking.current) {
          ref.current.setProgress(progressBarProgress);
        }
      }
      if (typeof bufferProgress === "number") {
        if (!seeking.current) {
          ref.current.setBufferProgress(bufferProgress);
        }
      }
    }
  }, [progress]);

  const { width } = useWindowDimensions();
  return (
    <View className="flex-row items-center justify-center w-full">
      <Text type="title" className="text-md py-0 absolute left-2">
        {formatPlaybackTime(
          Math.floor(Math.min(progress.position, progress.duration)),
        )}
      </Text>
      <Slider
        width={width * 0.7}
        ref={ref}
        onSlideStart={() => (seeking.current = true)}
        onSlideFinish={(value) => {
          seeking.current = false;
          TrackPlayer.seekTo(progress.duration * value);
        }}
      />
      <Text type="title" className="text-md py-0 absolute right-2">
        {formatPlaybackTime(Math.floor(progress.duration))}
      </Text>
    </View>
  );
}

export default function TrackPlayerStatusBar() {
  const { playing: isPlaying } = useIsPlaying();
  const currentTrack = useActiveTrack();

  if (!currentTrack) {
    return null;
  }

  return (
    <BottomSheet
      enablePanDownToClose
      onClose={() => TrackPlayer.reset()}
      snapPoints={[180]}
      style={{
        ...Platform.select({
          ios: {
            shadowOffset: {
              width: 0,
              height: 12,
            },
            shadowOpacity: 0.75,
            shadowRadius: 16.0,
            shadowColor: "#000",
          },
          android: {
            elevation: 24,
          },
        }),
        backgroundColor: "#4b5563",
        borderRadius: 24,
      }}
      backgroundStyle={{ backgroundColor: "#4b5563" }}
    >
      <View className="flex-1 bg-gray-600 items-center justify-center">
        <Text type="title" className="text-xl py-0" numberOfLines={1}>
          {currentTrack.title}
        </Text>
        <Text type="subtitle" className="py-2" numberOfLines={1}>
          {currentTrack.artist}
        </Text>
        <AudioSeeker />
        {/* Add play/pause button and seek 15 seconds forward/backward */}
        <View className="flex-1 flex-row items-center">
          <View className="flex-row items-center gap-6">
            <Pressable className="rounded-full items-center" activeScale={0.8}>
              <TabBarIcon
                onPress={() => TrackPlayer.seekBy(-15)}
                name="play-back-circle"
                color="white"
                style={{ alignSelf: "center" }}
                size={45}
              />
            </Pressable>
            <Pressable className="rounded-full items-center" activeScale={0.8}>
              <TabBarIcon
                onPress={() =>
                  isPlaying ? TrackPlayer.pause() : TrackPlayer.play()
                }
                name={isPlaying ? "pause-circle-sharp" : "play-circle-sharp"}
                color="white"
                style={{ alignSelf: "center" }}
                size={60}
              />
            </Pressable>
            <Pressable className="rounded-full items-center" activeScale={0.8}>
              <TabBarIcon
                onPress={() => TrackPlayer.seekBy(15)}
                name="play-forward-circle"
                color="white"
                style={{ alignSelf: "center" }}
                size={45}
              />
            </Pressable>
          </View>
        </View>
      </View>
    </BottomSheet>
  );
}
