import { StyleSheet } from 'react-native';
import {
  COVER_HEIGHT,
  COVER_WIDTH,
  MANGA_HEIGHT,
  MANGA_SOURCE_BADGE_SIZE,
  MANGA_WIDTH,
} from '@/components/composites/Manga';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  flagContainer: {
    position: 'absolute',
    top: theme.style.size.xl * 2 + theme.style.size.s,
    right: theme.style.size.l,
    ...theme.helpers.elevation(4),
  },
  source: {
    width: MANGA_SOURCE_BADGE_SIZE,
    height: MANGA_SOURCE_BADGE_SIZE,
  },
  sourceContainer: {
    position: 'absolute',
    top: theme.style.size.l,
    right: theme.style.size.l,
    backgroundColor: theme.palette.common.white,
    borderRadius: theme.style.borderRadius.s,
    ...theme.helpers.elevation(4),
  },
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
    borderRadius: theme.style.borderRadius.xxl,
    height: 14, // to be changed in the future,
  },
  cover: {
    width: COVER_WIDTH,
    height: COVER_HEIGHT,
    borderRadius: theme.style.borderRadius.m,
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
    alignItems: 'center',
  },
});
