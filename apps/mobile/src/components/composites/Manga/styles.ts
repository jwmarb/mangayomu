import { StyleSheet } from 'react-native';
import {
  COVER_HEIGHT,
  COVER_WIDTH,
  MANGA_HEIGHT,
  MANGA_WIDTH,
} from '@/components/composites/Manga';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  view: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  container: {
    width: MANGA_WIDTH,
    height: MANGA_HEIGHT,
    padding: theme.style.size.m,
    gap: theme.style.size.m,
  },
  skeleton: {
    backgroundColor: theme.palette.skeleton,
  },
  skeletonText: {
    backgroundColor: theme.palette.skeleton,
    width: '100%',
    borderRadius: theme.style.borderRadius,
    height: 14, // to be changed in the future,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: theme.style.borderRadius / 4,
    alignSelf: 'center',
  },
}));

export const listEmptyComponentStyles = StyleSheet.create({
  skeleton: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  contentContainerStyle: {
    paddingBottom: MANGA_HEIGHT,
  },
});
