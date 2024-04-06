import { COVER_WIDTH_HEIGHT_RATIO } from '@/components/composites/Manga';
import { HEADER_HEIGHT } from '@/components/composites/types';
import { createStyles } from '@/utils/theme';

export const MAX_FLOATING_IMAGE_WIDTH = 350;
export const MAX_FLOATING_IMAGE_HEIGHT = 350;

export const styles = createStyles((theme) => ({
  headerRight: {
    flexGrow: 0,
    flexShrink: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  imageBackground: {
    paddingTop: theme.style.screen.paddingVertical + HEADER_HEIGHT,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    flexDirection: 'row',
    gap: theme.style.size.m,
  },
  titleContainer: {
    flexShrink: 1,
    alignSelf: 'center',
  },
  authors: {
    paddingVertical: theme.style.size.m,
  },
  floatingImage: {
    width: 130,
    height: 130 / COVER_WIDTH_HEIGHT_RATIO,
    borderRadius: theme.style.borderRadius / 4,
  },
  metaContainer: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingVertical: theme.style.size.l,
    backgroundColor: theme.palette.background.paper,
    gap: theme.style.size.m,
    borderBottomWidth: 1,
    borderColor: theme.palette.divider,
  },
  actionContainer: {
    backgroundColor: theme.palette.background.menu,
    borderRadius: theme.style.borderRadius,
    flexDirection: 'row',
  },
  statusContainer: {
    paddingVertical: theme.style.size.s,
  },
  contentContainerStyle: {
    paddingBottom: theme.style.size.xxl * 3,
  },
  sourceContainer: {
    flexDirection: 'row',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
}));
