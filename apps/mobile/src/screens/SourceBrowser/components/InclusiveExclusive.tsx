import { MutableInclusiveExclusiveFilter } from '@mangayomu/schema-creator';
import React from 'react';
import { View } from 'react-native';
import { AscendingStringComparator, binary } from '@mangayomu/algorithms';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';
import Icon from '@/components/primitives/Icon';
import {
  ITEM_HEIGHT,
  useInclusiveExclusiveDispatcher,
} from '@/screens/SourceBrowser/components/shared';
import Chip from '@/components/primitives/Chip';
import { ChipProps } from '@/components/primitives/Chip/Chip';
import Modal from '@/components/primitives/Modal';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    height: ITEM_HEIGHT,
    alignItems: 'center',
    flexDirection: 'row',
    gap: theme.style.size.s,
  },
  chipsContainer: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: theme.style.size.s,
  },
  chip: {
    borderColor: theme.palette.divider,
    borderRadius: theme.style.borderRadius / 3,
    borderWidth: 1.5,
    flexDirection: 'row',
    overflow: 'hidden',
  },
  chipPressable: {
    flex: 0,
    flexDirection: 'row',
    paddingVertical: theme.style.size.m,
    paddingHorizontal: theme.style.size.l,
    alignItems: 'center',
    gap: theme.style.size.s,
  },
  text: {
    flexShrink: 1,
  },
}));

type InclusiveExclusiveProps = {
  title: string;
  inclusiveExclusive: MutableInclusiveExclusiveFilter<string>;
};

const included = <Icon type="icon" name="check" size="small" />;
const excluded = <Icon type="icon" name="cancel" size="small" />;

function InclusiveExclusive(props: InclusiveExclusiveProps) {
  const { inclusiveExclusive, title } = props;
  const contrast = useContrast();
  const modalRef = React.useRef<Modal>(null);
  const style = useStyles(styles, contrast);
  function mapInclusiveExclusiveFields(x: string) {
    if (
      binary.search(
        inclusiveExclusive.exclude,
        x,
        AscendingStringComparator,
      ) !== -1
    )
      return (
        <ChipFilter
          filterKey={title}
          color="error"
          icon={excluded}
          key={x}
          title={
            inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x
          }
        />
      );
    if (
      binary.search(
        inclusiveExclusive.include,
        x,
        AscendingStringComparator,
      ) !== -1
    )
      return (
        <ChipFilter
          filterKey={title}
          color="success"
          icon={included}
          key={x}
          title={
            inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x
          }
        />
      );

    return (
      <ChipFilter
        filterKey={title}
        key={x}
        title={
          inclusiveExclusive.map != null ? inclusiveExclusive.map[x] ?? x : x
        }
      />
    );
  }

  function handleOnPress() {
    modalRef.current?.show();
  }

  return (
    <>
      <View style={style.container}>
        <Text bold>{title}</Text>
      </View>
      <View style={style.chipsContainer}>
        {inclusiveExclusive.fields.length <= 12 ? (
          inclusiveExclusive.fields.map(mapInclusiveExclusiveFields)
        ) : (
          <Chip
            icon={<Icon type="icon" name="plus" />}
            onPress={handleOnPress}
            title="Add filter"
            variant="filled"
          />
        )}
      </View>
      <Modal ref={modalRef}>
        <Text>Hlelo World</Text>
      </Modal>
    </>
  );
}

const ChipFilter = React.memo((props: ChipProps & { filterKey: string }) => {
  const { color, title, filterKey, ...rest } = props;
  const setInclusiveExclusive = useInclusiveExclusiveDispatcher();
  function onPress() {
    switch (color) {
      case 'error':
        setInclusiveExclusive({ type: 'none', title: filterKey, item: title });
        break;
      case 'success':
        setInclusiveExclusive({
          type: 'exclude',
          title: filterKey,
          item: title,
        });
        break;
      default:
        setInclusiveExclusive({
          type: 'include',
          title: filterKey,
          item: title,
        });
        break;
    }
  }
  return <Chip {...rest} onPress={onPress} title={title} color={color} />;
});

export default React.memo(InclusiveExclusive);
