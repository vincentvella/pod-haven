import TrackPlayer from "react-native-track-player";

TrackPlayer.registerPlaybackService(() => require("./PlaybackService"));
