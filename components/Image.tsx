import { cssInterop } from "nativewind";
import { Image as ExpoImage } from "expo-image";

cssInterop(ExpoImage, {
  className: "style",
});

export const Image = ExpoImage;
