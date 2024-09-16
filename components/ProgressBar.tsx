import { useEffect, useRef } from "react";
import { View, useWindowDimensions } from "react-native";
import Slider, { ISlider } from "rn-video-slider";

export default function ProgressBar({
  progress,
  duration,
}: {
  progress: number;
  duration: number;
}) {
  const ref = useRef<ISlider>(null);
  const { width } = useWindowDimensions();

  useEffect(() => {
    if (ref.current) {
      const state =
        Math.floor(Math.min(progress, duration)) / Math.floor(duration);
      ref.current.setProgress(state);
    }
  }, [progress]);

  return (
    <View className="flex-row items-center justify-center w-full">
      <Slider width={width * 0.9} ref={ref} tapActive={false} thumbSize={0} />
    </View>
  );
}
