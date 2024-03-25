import { MangaSource } from '@mangayomu/mangascraper';
import { useNavigation } from '@react-navigation/native';
import React from 'react';
import { BackHandler, Linking } from 'react-native';
import BottomSheet from '@/components/composites/BottomSheet';
import Icon from '@/components/primitives/Icon';
import IconButton from '@/components/primitives/IconButton';
import Text from '@/components/primitives/Text';
import TextInput from '@/components/primitives/TextInput';
import useBoolean from '@/hooks/useBoolean';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { styles } from '@/screens/SourceBrowser/styles';

export type UseSourceBrowserHeaderParams = {
  source: MangaSource;
  onUserInput: (text?: string) => void;
  defaultInput: string;
  ref: React.RefObject<BottomSheet>;
};

/**
 * A minified version of the modified version `useCollapsibleHeader`
 * @param param The parameters for this hook
 * @returns Returns a collapsible object
 */
export default function useSourceBrowserHeader({
  source,
  onUserInput,
  defaultInput,
  ref,
}: UseSourceBrowserHeaderParams) {
  const navigation = useNavigation();
  const [showSearchBar, toggleSearchBar] = useBoolean();
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (showSearchBar) {
          toggleSearchBar(false);
          return true;
        }
        return false;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [showSearchBar]);

  const collapsible = useCollapsibleHeader(
    {
      showHeaderLeft: false,
      headerStyle: showSearchBar ? style.headerSearchBar : undefined,
      headerRightStyle: showSearchBar
        ? style.headerRightSearchBar
        : style.headerRight,
      headerCenterStyle: showSearchBar
        ? style.headerCenterSearchBar
        : style.headerCenter,
      headerRight: (
        <>
          {!showSearchBar && (
            <>
              <IconButton
                icon={<Icon type="icon" name="magnify" />}
                onPress={() => toggleSearchBar(true)}
              />
              <IconButton
                onPress={() => Linking.openURL(source.URL.href)}
                icon={<Icon type="icon" name="web" />}
              />
            </>
          )}
          <IconButton
            icon={<Icon type="icon" name="filter" />}
            onPress={() => ref.current?.open()}
          />
        </>
      ),
      headerCenter: (
        <>
          {!showSearchBar && (
            <>
              <IconButton
                onPress={() => navigation.goBack()}
                icon={<Icon type="icon" name="arrow-left" />}
              />
              <Text variant="h4" bold numberOfLines={1}>
                {source.NAME}
              </Text>
            </>
          )}
          {showSearchBar && (
            <TextInput
              iconButton
              defaultValue={defaultInput}
              onSubmitEditing={(e) => onUserInput(e.nativeEvent.text)}
              icon={
                <IconButton
                  onPress={() => toggleSearchBar(false)}
                  icon={<Icon type="icon" name="arrow-left" />}
                  size="small"
                />
              }
              placeholder="Search for a manga..."
            />
          )}
        </>
      ),
    },
    [showSearchBar],
  );
  return collapsible;
}
