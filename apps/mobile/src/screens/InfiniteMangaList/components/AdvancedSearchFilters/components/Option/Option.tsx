import Button from '@components/Button';
import Icon from '@components/Icon';
import { Menu, MenuItem } from '@components/Menu';
import { Stack } from '@components/Stack';
import Text from '@components/Text';
import React from 'react';
import { OptionProps } from './Option.interfaces';

const Option: React.FC<OptionProps> = (props) => {
  const { options, onChange = () => void 0, selected, name, map } = props;
  const handleOnChange = (val: string) => {
    onChange(name, val);
  };
  return (
    <Stack
      align-items="center"
      justify-content="space-between"
      space="s"
      flex-direction="row"
      mx="m"
    >
      <Text>{name}</Text>
      <Menu
        trigger={
          <Button
            label={selected}
            iconPlacement="right"
            icon={<Icon type="font" name="chevron-down" />}
          />
        }
      >
        {options.map((x) => (
          <MenuItem
            key={x}
            optionKey={x}
            color={x === selected ? 'primary' : undefined}
            onSelect={handleOnChange}
          >
            {map ? map[x] : x}
          </MenuItem>
        ))}
      </Menu>
    </Stack>
  );
};

export default React.memo(Option);
