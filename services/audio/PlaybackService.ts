import TrackPlayer, { Event } from "react-native-track-player";
import { markEpisodeAsListened, saveEpisodeProgress } from "./progressHandlers";
import { deleteAsync, documentDirectory } from "expo-file-system";

module.exports = async function () {
  TrackPlayer.addEventListener(
    Event.RemotePlay,
    async () => await TrackPlayer.play(),
  );
  TrackPlayer.addEventListener(
    Event.RemoteStop,
    async () => await TrackPlayer.stop(),
  );
  TrackPlayer.addEventListener(
    Event.RemotePause,
    async () => await TrackPlayer.pause(),
  );
  TrackPlayer.addEventListener(
    Event.RemoteNext,
    async () => await TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(
    Event.RemotePrevious,
    async () => await TrackPlayer.skipToPrevious(),
  );
  TrackPlayer.addEventListener(
    Event.RemoteDuck,
    async ({ paused, permanent }) => {
      if (permanent) {
        await TrackPlayer.stop();
        return;
      }
      if (paused) {
        await TrackPlayer.pause();
      } else {
        await TrackPlayer.play();
      }
    },
  );

  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    async ({ lastTrack, lastPosition }) => {
      if (!lastTrack) {
        return;
      }
      if (Math.ceil(lastPosition) >= (lastTrack.duration ?? 0)) {
        await markEpisodeAsListened(lastTrack.id);
        await deleteAsync(
          `${documentDirectory}${lastTrack.headers?.id}.${lastTrack.headers?.ext}`,
        );
      } else {
        if (lastPosition !== 0) {
          await saveEpisodeProgress(lastTrack.id, lastPosition);
        }
      }
    },
  );

  TrackPlayer.addEventListener(
    Event.PlaybackProgressUpdated,
    async ({ position }) => {
      const track = await TrackPlayer.getActiveTrack();
      if (track && Math.floor(position) > 0) {
        await saveEpisodeProgress(track.id, Math.floor(position));
      }
    },
  );
};
