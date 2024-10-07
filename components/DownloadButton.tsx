import {
  DownloadProgressData,
  FileSystemNetworkTaskProgressCallback,
  createDownloadResumable,
  documentDirectory,
  getInfoAsync,
} from "expo-file-system";
import CircularProgress from "react-native-circular-progress-indicator";
import { Pressable } from "./Pressable";
import { TabBarIcon } from "./navigation/TabBarIcon";
import { useEffect, useRef, useState } from "react";
import { getFileExtension } from "@/services/fs/getFileExtension";

export type DownloadButtonProps = {
  id: number;
  uri: string;
};

export default function DownloadButton({ uri, id }: DownloadButtonProps) {
  const [isAttemptingToDownload, setIsAttemptingToDownload] = useState(false);
  const [downloaded, setDownloaded] = useState(false);
  const [progress, setProgress] = useState(0);
  const fileName = useRef<string>(
    `${documentDirectory}${id}.${getFileExtension(uri)}`,
  );
  const onDownloadProgress: FileSystemNetworkTaskProgressCallback<
    DownloadProgressData
  > = ({ totalBytesWritten, totalBytesExpectedToWrite }) => {
    setProgress((p) => {
      const newValue = (totalBytesWritten / totalBytesExpectedToWrite) * 100;
      if (newValue === 100) {
        return 100;
      }

      const boundary = Math.floor(newValue / 5) * 5;
      if (newValue > boundary) {
        return boundary;
      }

      return p;
    });

    if (totalBytesWritten === totalBytesExpectedToWrite) {
      setDownloaded(true);
    }
  };
  const downloadEpisode = async () => {
    if (isAttemptingToDownload) {
      return;
    }
    setIsAttemptingToDownload(true);
    const downloadResumable = createDownloadResumable(
      uri,
      fileName.current,
      {},
      onDownloadProgress,
    );
    await downloadResumable.downloadAsync();
  };

  useEffect(() => {
    async function checkDownloaded() {
      const { exists } = await getInfoAsync(fileName.current);
      if (exists) {
        setDownloaded(true);
      }
    }
    checkDownloaded();
  }, []);

  const isDownloading =
    isAttemptingToDownload && progress !== 0 && progress !== 100;

  return (
    <Pressable
      disabled={downloaded || isDownloading}
      onPress={downloadEpisode}
      style={{ height: 50 }}
    >
      {isDownloading && (
        <CircularProgress
          value={progress}
          radius={25}
          showProgressValue={false}
          activeStrokeWidth={4}
          inActiveStrokeWidth={4}
          duration={1}
        />
      )}
      <TabBarIcon
        name={downloaded ? "download" : "download-outline"}
        color="white"
        size={30}
        style={{
          alignSelf: "center",
          position: isDownloading ? "absolute" : "relative",
          top: isDownloading ? 8 : -4,
          paddingVertical: isDownloading ? 0 : 12,
          paddingHorizontal: isDownloading ? 0 : 10,
        }}
      />
    </Pressable>
  );
}
