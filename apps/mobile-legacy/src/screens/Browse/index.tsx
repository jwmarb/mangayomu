import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import LazyFallback from '@components/LazyFallback';
import Stack from '@components/Stack';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import { HomeTabProps } from '@navigators/Home/Home.interfaces';
import { useAppDispatch } from '@redux/main';
import { setQuery } from '@redux/slices/browse';
import React from 'react';
import {
  NativeSyntheticEvent,
  TextInputSubmitEditingEventData,
} from 'react-native';
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./Browse') });

const LazyBrowse = React.lazy(() => import('./Browse'));

export type BrowseMethods = {
  handleOnSubmitEditing: (
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) => void;
};

export default function Browse(props: HomeTabProps<'Browse'>) {
  const query = useAppSelector((state) => state.browse.query);
  const loading = useAppSelector((state) => state.browse.loading);
  const dispatch = useAppDispatch();
  const [showSearchBar, setShowSearchBar] = useBoolean(
    props.route.params?.initialQuery != null,
  );
  const ref = React.useRef<BrowseMethods>(null);
  const collapsible = useCollapsibleTabHeader({
    headerTitle: 'Browse',
    loading,
    showHeaderRight: !showSearchBar,
    headerCenter: showSearchBar ? (
      <Box mx="m">
        <Stack space="s" flex-direction="row">
          <Input
            defaultValue={query}
            onChangeText={(e) => dispatch(setQuery(e))}
            expanded
            onSubmitEditing={ref.current?.handleOnSubmitEditing}
            placeholder="Universal search..."
            iconButton={
              <IconButton
                icon={<Icon type="font" name="arrow-left" />}
                onPress={() => setShowSearchBar()}
              />
            }
          />
        </Stack>
      </Box>
    ) : undefined,
    headerRight: (
      <IconButton
        icon={<Icon type="font" name="magnify" />}
        onPress={() => setShowSearchBar()}
      />
    ),
    headerLeftProps: {
      width: '33%',
    },
    showHeaderLeft: !showSearchBar,
    dependencies: [showSearchBar, query],
  });

  return (
    <React.Suspense fallback={LazyFallback}>
      <LazyBrowse
        ref={ref}
        {...collapsible}
        showSearchBar={showSearchBar}
        setShowSearchBar={setShowSearchBar}
        initialQuery={props.route.params?.initialQuery}
      />
    </React.Suspense>
  );
}
