import { MMKV } from "react-native-mmkv";

export const storage = new MMKV({
  id: `user-storage`,
  path: `user/storage`,
  encryptionKey: "pod-haven",
});
