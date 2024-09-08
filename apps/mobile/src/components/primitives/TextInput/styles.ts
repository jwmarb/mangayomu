import { variants } from '@/components/primitives/Text/styles';
import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  container: {
    paddingRight: theme.style.size.xxl * 2.5,
    paddingLeft: theme.style.size.xxl * 2,
    height: theme.style.size.xl * 3,
    borderRadius: theme.style.borderRadius.xxl,
    backgroundColor: theme.palette.action.textInput,
    color: theme.palette.text.primary,
    ...variants.body1,
  },
  containerIconButton: {
    paddingRight: theme.style.size.xxl * 2.5,
    paddingLeft: theme.style.size.xxl * 2.5,
    height: theme.style.size.xl * 3,
    borderRadius: theme.style.borderRadius.xxl,
    backgroundColor: theme.palette.action.textInput,
    color: theme.palette.text.primary,
    ...variants.body1,
  },
  numpadContainer: {
    paddingHorizontal: theme.style.size.xl,
    height: theme.style.size.xl * 3,
    borderRadius: theme.style.borderRadius.m,
    backgroundColor: theme.palette.action.textInput,
    color: theme.palette.text.primary,
    ...variants.body1,
  },
  containerNoIcon: {
    paddingRight: theme.style.size.xxl * 2.5,
    paddingLeft: theme.style.size.xxl,
    height: theme.style.size.xl * 3,
    borderRadius: theme.style.borderRadius.xxl,
    backgroundColor: theme.palette.action.textInput,
    color: theme.palette.text.primary,
    ...variants.body1,
  },
  view: {
    justifyContent: 'center',
  },
  iconLeft: {
    position: 'absolute',
    left: theme.style.size.l,
  },
  iconLeftButton: {
    position: 'absolute',
    left: theme.style.size.l,
    zIndex: 1,
  },
  iconRight: {
    position: 'absolute',
    right: theme.style.size.l,
    zIndex: 1,
  },
}));
