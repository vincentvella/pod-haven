import TrackPlayer, {
  AppKilledPlaybackBehavior,
  Capability,
} from "react-native-track-player";
import { useEffect, useState } from "react";

function useSetupTrackPlayer() {
  const [initializedTrackPlayer, setInitializedTrackPlayer] = useState(false);
  useEffect(() => {
    if (!initializedTrackPlayer) {
      TrackPlayer.setupPlayer().then(() => {
        TrackPlayer.updateOptions({
          progressUpdateEventInterval: 1,
          // Media control capabilities
          capabilities: [
            Capability.Play,
            Capability.Pause,
            Capability.SkipToNext,
            Capability.SkipToPrevious,
            Capability.Stop,
          ],
          // Capabilities that will show up when the notification is in the compact form on Android
          compactCapabilities: [Capability.Play, Capability.Pause],
          android: {
            // This is the default behavior
            appKilledPlaybackBehavior:
              AppKilledPlaybackBehavior.ContinuePlayback,
          },
        }).then(() => {
          setInitializedTrackPlayer(true);
        });
      });
    }
  }, [initializedTrackPlayer]);
  return initializedTrackPlayer;
}

export default useSetupTrackPlayer;
