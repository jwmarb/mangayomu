import Pressable from '@/components/primitives/Pressable';
import { PressableProps } from '@/components/primitives/Pressable/Pressable';
import Text, { TextProps } from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import { View, ViewProps } from 'react-native';

export type MiscellaneousTitleProps = {
  title: string;
  description?: string;
  isSubtitle?: boolean;
  alignment?: TextProps['alignment'];
};

export type MiscellaneousProps = React.PropsWithChildren & PressableProps;

export type MiscellaneousContentProps = React.PropsWithChildren & ViewProps;

const styles = createStyles((theme) => ({
  title: {
    flexShrink: 1,
  },
  content: {
    flexGrow: 1,
  },
  container: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: theme.style.size.m,
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    paddingVertical: theme.style.screen.paddingVertical,
  },
}));

function MiscellaneousOption(props: MiscellaneousProps) {
  const { children, style: styleProp, ...rest } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const pressableStyle: PressableProps['style'] =
    typeof styleProp === 'function'
      ? (state) => [style.container, styleProp(state)]
      : [style.container, styleProp];
  return (
    <Pressable style={pressableStyle} {...rest}>
      {children}
    </Pressable>
  );
}

MiscellaneousOption.Title = function (props: MiscellaneousTitleProps) {
  const { title, description, isSubtitle = false, alignment = 'left' } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return (
    <View style={style.title}>
      <Text variant={isSubtitle ? 'body1' : 'h4'} alignment={alignment}>
        {title}
      </Text>
      {description && (
        <Text color="textSecondary" variant={isSubtitle ? 'body2' : 'body1'}>
          {description}
        </Text>
      )}
    </View>
  );
};

MiscellaneousOption.Content = function (props: MiscellaneousContentProps) {
  const { style: styleProp, ...rest } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  return <View style={[styleProp, style.content]} {...rest} />;
};

export default MiscellaneousOption;
