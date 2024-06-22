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
    borderTopLeftRadius: theme.style.borderRadius.l,
    borderTopRightRadius: theme.style.borderRadius.l,
    overflow: 'hidden',
  },
  textInputStyle: {
    borderRadius: 0,
  },
  header: {
    padding: theme.style.size.xxl,
    width: '90%',
    backgroundColor: theme.palette.background.paper,
    borderTopLeftRadius: theme.style.borderRadius.xxl,
    borderTopRightRadius: theme.style.borderRadius.xxl,
  },
  content: {
    padding: theme.style.size.xxl,
    width: '90%',
    maxHeight: '50%',
    backgroundColor: theme.palette.background.paper,
    borderBottomLeftRadius: theme.style.borderRadius.xxl,
    borderBottomRightRadius: theme.style.borderRadius.xxl,
  },
  flatListFooter: {
    paddingBottom: theme.style.size.xxl * 2,
  },
}));
