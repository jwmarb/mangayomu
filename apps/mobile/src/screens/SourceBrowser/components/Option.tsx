import { MutableOptionFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { View } from 'react-native';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Button from '@/components/primitives/Button';
import Icon from '@/components/primitives/Icon';
import Menu from '@/components/composites/Menu';
import { useOptionDispatcher } from '@/screens/SourceBrowser/components/shared';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal * 2,
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: theme.style.size.m,
    alignItems: 'center',
  },
}));

const selectedIcon = <Icon type="icon" name="check" />;

const notSelectedIcon = (
  <Icon type="icon" name="check" style={{ opacity: 0 }} />
);
type OptionProps = {
  title: string;
  option: MutableOptionFilter<string>;
};

function Option(props: OptionProps) {
  const { title, option } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  const setOption = useOptionDispatcher();

  function handleOnMenuItem(id: string) {
    setOption({ item: id, title });
  }

  return (
    <View style={style.container}>
      <Text numberOfLines={1}>{title}</Text>
      <Menu
        onMenuItem={handleOnMenuItem}
        trigger={
          <Button
            {...props}
            title={option.value}
            icon={<Icon type="icon" name="chevron-down" />}
            iconPlacement="right"
          />
        }
      >
        {option.options.map((x) => (
          <Menu.Item
            key={x}
            id={x}
            text={x}
            color={x === option.value ? 'primary' : undefined}
            bold={x === option.value}
            icon={x === option.value ? selectedIcon : notSelectedIcon}
          />
        ))}
      </Menu>
    </View>
  );
}

export default React.memo(Option);
