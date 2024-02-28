// export { default } from './MangaView';
import { useTheme } from '@emotion/react';
import IconButton from '@components/IconButton';
import Icon from '@components/Icon';
import { Linking, Share } from 'react-native';
import LazyFallback from '@components/LazyFallback';
import useCollapsibleHeader from '@hooks/useCollapsibleHeader';
import { RootStackProps } from '@navigators/Root/Root.interfaces';
import React from 'react';
const LazyMangaView = React.lazy(() => import('./MangaView'));

export default function MangaView(props: RootStackProps<'MangaView'>) {
  const {
    route: { params },
  } = props;
  const theme = useTheme();
  const buttonInterpolateColor =
    theme.mode === 'dark'
      ? theme.palette.text.secondary
      : theme.helpers.getContrastText(theme.palette.background.paper);

  useCollapsibleHeader({
    headerTitle: '',
    backButtonColor: theme.palette.mangaViewerBackButtonColor,
    backButtonStyle: { color: buttonInterpolateColor },
    backButtonRippleColor: theme.palette.action.ripple,
    headerRight: (
      <IconButton
        color={theme.palette.mangaViewerBackButtonColor}
        rippleColor={theme.palette.action.ripple}
        animated
        icon={<Icon type="font" name="web" color={buttonInterpolateColor} />}
        onPress={async () => {
          const canOpenURL = await Linking.canOpenURL(params.link);
          if (canOpenURL) Linking.openURL(params.link);
        }}
        onLongPress={async () => {
          await Share.share({
            url: params.link,
            message: params.link,
          });
        }}
      />
    ),
    dependencies: [theme],
  });

  return (
    <React.Suspense fallback={LazyFallback}>
      <LazyMangaView {...props} />
    </React.Suspense>
  );
}
