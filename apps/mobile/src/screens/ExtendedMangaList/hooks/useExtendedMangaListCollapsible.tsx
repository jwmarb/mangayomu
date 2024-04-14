import React from 'react';
import { BackHandler } from 'react-native';
import IconButton from '@/components/primitives/IconButton';
import TextInput from '@/components/primitives/TextInput';
import useBoolean from '@/hooks/useBoolean';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import useUserInput from '@/hooks/useUserInput';
import { styles } from '@/screens/ExtendedMangaList/styles';
import { FetchedMangaResults, titleMapping } from '@/stores/explore';
import Icon from '@/components/primitives/Icon';

export type UseExtendedMangaListCollapsibleOptions = {
  type: keyof FetchedMangaResults;
};

export default function useExtendedMangaListCollapsible({
  type,
}: UseExtendedMangaListCollapsibleOptions) {
  const [show, toggle] = useBoolean();
  const contrast = useContrast();
  const { input, setInput } = useUserInput();
  const style = useStyles(styles, contrast);
  React.useEffect(() => {
    const subscription = BackHandler.addEventListener(
      'hardwareBackPress',
      () => {
        if (show) {
          toggle(false);
          return true;
        }
        return false;
      },
    );
    return () => {
      subscription.remove();
    };
  }, [show]);

  function handleOnShow() {
    toggle(true);
  }

  function handleOnHide() {
    toggle(false);
  }
  const collapsible = useCollapsibleHeader(
    {
      title: titleMapping[type],
      headerLeftStyle: style.headerLeftStyle,
      headerCenterStyle: !show ? style.headerCenterStyle : undefined,
      headerStyle: style.headerStyle,
      headerRightStyle: style.headerRightStyle,
      headerCenter: show ? (
        <TextInput
          onChangeText={setInput}
          defaultValue={input}
          iconButton
          icon={
            <IconButton
              icon={<Icon type="icon" name="arrow-left" />}
              onPress={handleOnHide}
              size="small"
            />
          }
        />
      ) : undefined,
      showHeaderLeft: !show,
      showHeaderRight: !show,
      headerRight: (
        <IconButton
          icon={<Icon type="icon" name="magnify" />}
          onPress={handleOnShow}
        />
      ),
    },
    [show],
  );

  return { collapsible, input };
}
