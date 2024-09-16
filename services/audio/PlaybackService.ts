import TrackPlayer, { Event } from "react-native-track-player";
import { markEpisodeAsListened, saveEpisodeProgress } from "./progressHandlers";

module.exports = async function () {
  TrackPlayer.addEventListener(Event.RemotePlay, () => TrackPlayer.play());
  TrackPlayer.addEventListener(Event.RemoteStop, () => TrackPlayer.stop());
  TrackPlayer.addEventListener(Event.RemotePause, () => TrackPlayer.pause());
  TrackPlayer.addEventListener(Event.RemoteNext, () =>
    TrackPlayer.skipToNext(),
  );
  TrackPlayer.addEventListener(Event.RemotePrevious, () =>
    TrackPlayer.skipToPrevious(),
  );
  TrackPlayer.addEventListener(Event.RemoteDuck, ({ paused, permanent }) => {
    if (permanent) {
      TrackPlayer.stop();
      return;
    }
    if (paused) {
      TrackPlayer.pause();
    } else {
      TrackPlayer.play();
    }
  });

  TrackPlayer.addEventListener(
    Event.PlaybackActiveTrackChanged,
    ({ lastTrack, lastPosition }) => {
      if (!lastTrack) {
        return;
      }
      if (Math.ceil(lastPosition) >= (lastTrack.duration ?? 0)) {
        markEpisodeAsListened(lastTrack.id);
      } else {
        if (lastPosition !== 0) {
          saveEpisodeProgress(lastTrack.id, lastPosition);
        }
      }
    },
  );

  TrackPlayer.addEventListener(
    Event.PlaybackProgressUpdated,
    async ({ position }) => {
      const track = await TrackPlayer.getActiveTrack();
      if (track && Math.floor(position) > 0) {
        saveEpisodeProgress(track.id, Math.floor(position));
      }
    },
  );
};
