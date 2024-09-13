import { remapProps } from "nativewind";
import { PressableScale } from "react-native-pressable-scale";

remapProps(PressableScale, {
  className: "style",
});

export const Pressable = PressableScale;
