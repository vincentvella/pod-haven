import TrackPlayerStatusBar from "@/services/audio/TrackPlayerStatusBar";
import { Slot } from "expo-router";

export default function TabLayout() {
  return (
    <>
      <Slot />
      <TrackPlayerStatusBar />
    </>
  );
}
