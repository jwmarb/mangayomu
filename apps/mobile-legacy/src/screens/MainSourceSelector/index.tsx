// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./MainSourceSelector') });
import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { BottomSheetMethods } from '@gorhom/bottom-sheet/lib/typescript/types';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import { useAppDispatch } from '@redux/main';
import { setQuery } from '@redux/slices/mainSourceSelector';
import React from 'react';
const LazyMainSourceSelector = React.lazy(() => import('./MainSourceSelector'));

export interface MainSourceSelectorProps
  extends ReturnType<typeof useCollapsibleHeader>,
    RootStackProps<'MainSourceSelector'> {
  show: boolean;
  toggle: (val?: boolean) => void;
}

export default function MainSourceSelector(
  props: RootStackProps<'MainSourceSelector'>,
) {
  const { navigation } = props;
  const query = useAppSelector((state) => state.mainSourceSelector.query);
  const dispatch = useAppDispatch();
  const [show, toggle] = useBoolean();
  const collapsible = useCollapsibleHeader({
    showHeaderLeft: false,
    header: (
      <Stack
        mx="m"
        flex-direction="row"
        space="s"
        align-items="center"
        justify-content="space-between"
        flex-grow
      >
        <Stack space="s" flex-direction="row" align-items="center" flex-grow>
          {show ? (
            <Input
              expanded
              defaultValue={query}
              placeholder="Type a source name..."
              clearButtonMode="always"
              onChangeText={(e) => dispatch(setQuery(e))}
              iconButton={
                <IconButton
                  icon={<Icon type="font" name="arrow-left" />}
                  onPress={() => toggle(false)}
                />
              }
            />
          ) : (
            <>
              <IconButton
                color="textPrimary"
                icon={<Icon type="font" name="arrow-left" />}
                onPress={() => navigation.goBack()}
              />
              <Text bold variant="header">
                Sources
              </Text>
            </>
          )}
        </Stack>
        <Box flex-direction="row">
          {!show && (
            <IconButton
              icon={<Icon type="font" name="magnify" />}
              onPress={() => toggle(true)}
            />
          )}
          <IconButton
            icon={<Icon type="font" name="filter" />}
            onPress={() => bottomSheet.current?.snapToIndex(1)}
          />
        </Box>
      </Stack>
    ),
    showBackButton: false,
    showHeaderRight: false,
    dependencies: [show, toggle, query, setQuery],
  });

  const bottomSheet = React.useRef<BottomSheetMethods>(null);

  return (
    <React.Suspense>
      <LazyMainSourceSelector ref={bottomSheet} {...props} {...collapsible} />
    </React.Suspense>
  );
}
