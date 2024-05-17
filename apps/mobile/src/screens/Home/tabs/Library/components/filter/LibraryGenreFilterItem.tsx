import React from 'react';
import { StyleSheet, View } from 'react-native';
import Chip from '@/components/primitives/Chip';
import { ChipProps } from '@/components/primitives/Chip/Chip';
import { ITEM_HEIGHT } from '@/screens/SourceBrowser/components/shared';
import Icon from '@/components/primitives/Icon';

const styles = StyleSheet.create({
  chipFilterItemHeight: {
    height: ITEM_HEIGHT,
  },
  chip: {
    flexGrow: 1,
  },
});

export type LibraryGenreFilterProps = {
  type: 'include' | 'exclude' | 'default';
  onSelect: (genre: string) => void;
  isFlatListItem?: boolean;
} & ChipProps;

const included = <Icon type="icon" name="check" size="small" />;
const excluded = <Icon type="icon" name="cancel" size="small" />;

function LibraryGenreFilterItem(props: LibraryGenreFilterProps) {
  const { type, onSelect, isFlatListItem = true, ...rest } = props;
  function handleOnPress() {
    onSelect(rest.title);
  }

  if (isFlatListItem)
    return (
      <View style={styles.chipFilterItemHeight}>
        {type === 'default' && (
          <Chip {...rest} style={styles.chip} onPress={handleOnPress} />
        )}
        {type === 'exclude' && (
          <Chip
            {...rest}
            style={styles.chip}
            color="error"
            icon={excluded}
            onPress={handleOnPress}
          />
        )}
        {type === 'include' && (
          <Chip
            {...rest}
            style={styles.chip}
            color="success"
            icon={included}
            onPress={handleOnPress}
          />
        )}
      </View>
    );

  return (
    <>
      {type === 'default' && (
        <Chip {...rest} style={styles.chip} onPress={handleOnPress} />
      )}
      {type === 'exclude' && (
        <Chip {...rest} color="error" icon={excluded} onPress={handleOnPress} />
      )}
      {type === 'include' && (
        <Chip
          {...rest}
          color="success"
          icon={included}
          onPress={handleOnPress}
        />
      )}
    </>
  );
}

export default React.memo(LibraryGenreFilterItem);
