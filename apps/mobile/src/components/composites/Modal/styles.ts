import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  backdrop: {
    backgroundColor: theme.palette.backdrop,
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
  },
  modal: {
    position: 'absolute',
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
  box: {
    backgroundColor: theme.palette.background.paper,
  },
  input: {
    width: '90%',
    backgroundColor: theme.palette.background.paper,
    borderTopLeftRadius: theme.style.borderRadius / 2,
    borderTopRightRadius: theme.style.borderRadius / 2,
    overflow: 'hidden',
  },
  textInputStyle: {
    borderRadius: 0,
  },
  header: {
    padding: theme.style.size.xxl,
    width: '90%',
    backgroundColor: theme.palette.background.paper,
    borderTopLeftRadius: theme.style.borderRadius,
    borderTopRightRadius: theme.style.borderRadius,
  },
  content: {
    padding: theme.style.size.xxl,
    width: '90%',
    maxHeight: '50%',
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.style.borderRadius,
    borderBottomRightRadius: theme.style.borderRadius,
  },
  flatListFooter: {
    paddingBottom: theme.style.size.xxl * 2,
  },
}));
