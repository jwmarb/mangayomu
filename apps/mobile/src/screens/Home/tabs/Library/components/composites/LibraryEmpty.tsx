import Icon from '@/components/primitives/Icon';
import Text from '@/components/primitives/Text';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import React from 'react';
import { View } from 'react-native';

const styles = createStyles((theme) => ({
  container: {
    justifyContent: 'center',
    alignItems: 'center',
    padding: theme.style.size.l,
    flexGrow: 1,
  },
}));

type LibraryEmptyProps = {
  hasFiltersApplied: boolean;
  isUsingSearch: boolean;
};

export default function LibraryEmpty(props: LibraryEmptyProps) {
  const { hasFiltersApplied, isUsingSearch } = props;
  const style = useStyles(styles);

  if (isUsingSearch) {
    return (
      <View style={style.container}>
        <Text>No results found</Text>
      </View>
    );
  }

  if (hasFiltersApplied) {
    return (
      <View style={style.container}>
        <Text>No mangas match the applied filters</Text>
      </View>
    );
  }

  return (
    <View style={style.container}>
      <Text variant="h4" alignment="center">
        Your library is empty
      </Text>
      <Text color="textSecondary" alignment="center">
        It's literally a desert in here... Why not add something to your
        library?
      </Text>
    </View>
  );
}
