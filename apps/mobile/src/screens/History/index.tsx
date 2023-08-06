import Box from '@components/Box';
import Icon from '@components/Icon';
import IconButton from '@components/IconButton';
import Input from '@components/Input';
import LazyFallback from '@components/LazyFallback';
import displayMessage from '@helpers/displayMessage';
import useAppSelector from '@hooks/useAppSelector';
import useBoolean from '@hooks/useBoolean';
import useCollapsibleTabHeader from '@hooks/useCollapsibleTabHeader';
import useDialog from '@hooks/useDialog';
import useUserHistory from '@hooks/useUserHistory';
import { useAppDispatch } from '@redux/main';
import { toggleIncognitoMode } from '@redux/slices/settings';
import React from 'react';
const LazyHistory = React.lazy(() => import('./History'));
// import { register } from 'react-native-bundle-splitter';
// export default register({ loader: () => import('./History') });

export type HistoryMethods = {
  onQuery: (e: string) => void;
};

export default function History() {
  const incognito = useAppSelector((state) => state.settings.history.incognito);
  const { clearMangaHistory } = useUserHistory({ incognito });
  const dialog = useDialog();
  const [isLoading, setTransition] = React.useTransition();
  const [show, setShow] = useBoolean();
  const [query, setQuery] = React.useState<string>('');
  const ref = React.useRef<HistoryMethods>(null);
  const dispatch = useAppDispatch();

  const props = useCollapsibleTabHeader({
    headerTitle: 'History',
    headerLeft: (
      <IconButton
        icon={<Icon type="font" name="magnify" />}
        onPress={() => setShow(true)}
        onLongPress={() => {
          displayMessage('History search');
        }}
      />
    ),
    showHeaderLeft: !show,
    showHeaderRight: !show,
    headerCenter: show ? (
      <Box px="m">
        <Input
          expanded
          onChangeText={(e) => {
            setQuery(e);
            ref.current?.onQuery(e);
          }}
          defaultValue={query}
          placeholder="Search for a title..."
          iconButton={
            <IconButton
              icon={<Icon type="font" name="arrow-left" />}
              onPress={() => setShow(false)}
            />
          }
        />
      </Box>
    ) : undefined,
    headerRight: (
      <>
        <IconButton
          icon={<Icon type="font" name="trash-can-outline" />}
          onPress={() => {
            dialog.open({
              title: 'Clear manga history?',
              message:
                'This will clear your entire manga history. This action cannot be undone.',
              actions: [
                { text: 'Cancel' },
                {
                  text: 'Yes, clear it',
                  type: 'destructive',
                  onPress: () => {
                    clearMangaHistory();
                    displayMessage('History cleared.');
                  },
                },
              ],
            });
          }}
        />
        <IconButton
          onPress={() => {
            dispatch(toggleIncognitoMode());
          }}
          icon={
            <Icon
              type="font"
              name={incognito ? 'incognito-circle' : 'incognito-circle-off'}
            />
          }
          color={incognito ? undefined : 'disabled'}
          onLongPress={() => {
            displayMessage('Toggle Incognito');
          }}
        />
      </>
    ),
    dependencies: [incognito, show],
  });
  return (
    <React.Suspense fallback={LazyFallback}>
      <LazyHistory ref={ref} {...props} query={query} />
    </React.Suspense>
  );
}
