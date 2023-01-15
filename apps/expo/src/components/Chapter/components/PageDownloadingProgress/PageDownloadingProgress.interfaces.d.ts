import * as FileSystem from 'expo-file-system';

export interface PageDownloadingProgressRef {
  pause(): Promise<void>;
  resume(): Promise<void>;
  cancel(): Promise<void>;
  download(): Promise<void>;
}

export interface PageDownloadingProgressProps {
  page: string;
  index: number;
  fileUri: string;
  onProgress: (progress: number, index: number) => void;
}
