import { remapProps } from "nativewind";
import { SafeAreaView as NativeSafeAreaView } from "react-native-safe-area-context";

remapProps(NativeSafeAreaView, {
  className: "style",
});

export const SafeAreaView = NativeSafeAreaView;
