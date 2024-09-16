import { Pressable } from "@/components/Pressable";
import { Text } from "@/components/Text";
import {
  checkForUpdateAsync,
  fetchUpdateAsync,
  reloadAsync,
  useUpdates,
} from "expo-updates";
import { useEffect } from "react";
import { ActivityIndicator, View } from "react-native";

function Updates() {
  const {
    isUpdatePending,
    isUpdateAvailable,
    isChecking,
    isDownloading,

    currentlyRunning,
    lastCheckForUpdateTimeSinceRestart,
  } = useUpdates();

  useEffect(() => {
    if (isUpdatePending) {
      // Update has successfully downloaded; apply it now
      reloadAsync();
    }
  }, [isUpdatePending]);

  // If true, we show the button to download and run the update
  const showDownloadButton = isUpdateAvailable;

  // Show whether or not we are running embedded code or an update
  const runTypeMessage = currentlyRunning.isEmbeddedLaunch
    ? "This app is running from built-in code"
    : "This app is running an update";

  if (__DEV__) {
    return null;
  }

  return (
    <View>
      <Text type="subtitle" className="text-2xl">
        Updates
      </Text>
      <Text>{runTypeMessage}</Text>
      <Text>{currentlyRunning.updateId}</Text>
      <Pressable
        disabled={isChecking}
        onPress={() => checkForUpdateAsync()}
        className="bg-green-500 rounded-full p-2 mx-12 items-center"
      >
        {isChecking ? (
          <ActivityIndicator color="black" />
        ) : (
          <Text className="dark:color-black font-bold">
            Check manually for updates
          </Text>
        )}
      </Pressable>
      <Text>{lastCheckForUpdateTimeSinceRestart?.toLocaleString()}</Text>
      {showDownloadButton && (
        <Pressable
          disabled={isDownloading}
          onPress={() => fetchUpdateAsync()}
          className="bg-green-500 rounded-full p-2 mx-12 items-center"
        >
          {isDownloading ? (
            <ActivityIndicator color="black" />
          ) : (
            <Text className="dark:color-black font-bold">
              Download and install update
            </Text>
          )}
        </Pressable>
      )}
    </View>
  );
}

export default Updates;
