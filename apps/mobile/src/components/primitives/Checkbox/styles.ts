import { createStyles } from '@/utils/theme';

export const styles = createStyles((theme) => ({
  pressableCheckbox: {
    flex: 0,
    width: 36,
    height: 36,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    padding: theme.style.size.s * 0.5,
    borderColor: 'transparent',
    borderRadius: theme.style.borderRadius.m,
    borderWidth: theme.style.borderWidth.s,
    backgroundColor: theme.palette.primary.main,
    flex: 0,
  },
  checkbox: {
    padding: theme.style.size.s * 0.5,

    borderColor: theme.palette.divider,
    borderRadius: theme.style.borderRadius.m,
    borderWidth: theme.style.borderWidth.s,
    flex: 0,
  },
  uncheckedIcon: {
    opacity: 0,
  },
}));
