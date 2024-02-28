export { default } from './OverlayHeader';
import useNetworkToast from '@screens/Reader/hooks/useNetworkToast';

export interface OverlayHeaderProps {
  style: {
    opacity: number;
  };
  mangaTitle: string;
  chapterTitle: string;
  onOpenSettingsMenu: () => void;
  onBookmark: () => void;
  onBack: () => void;
  onTitlePress: () => void;
  isBookmarked: boolean;
  topOverlayStyle: ReturnType<typeof useNetworkToast>['topOverlayStyle'];
}
