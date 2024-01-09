import React from 'react';
import Stack from '@components/Stack';
import Icon from '@components/Icon';
import Hyperlink from '@components/Hyperlink';
import Button from '@components/Button';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';
import useReaderBackgroundColor from '@hooks/useReaderBackgroundColor';
import { ImageErrorRendererProps } from '@screens/Reader/components/ChapterPage/components/ImageErrorRenderer';

const ImageErrorRenderer: React.FC<ImageErrorRendererProps> = (props) => {
  const { style, onReload, pageKey } = props;
  const { textSecondary, textPrimary } = useReaderBackgroundColor();
  const baseStyle = React.useMemo(
    () => ({
      width: style[1].width,
      height: style[1].height,
    }),
    [style[1].width, style[1].height],
  );
  return (
    <Stack
      style={baseStyle}
      space="s"
      position="absolute"
      align-items="center"
      flex-grow
      justify-content="center"
      px="m"
    >
      <Icon
        type="font"
        name="wifi-alert"
        color={textSecondary}
        size={moderateScale(128)}
      />
      <Text align="center" color={textPrimary}>
        There was an error loading this page.
      </Text>
      <Stack space="s" mx="m" mt="s">
        <Button
          onPress={onReload}
          label="Reload page"
          variant="contained"
          icon={<Icon type="font" name="refresh" />}
        />
        <Hyperlink url={pageKey} align="center" variant="book-title">
          Open page in browser
        </Hyperlink>
      </Stack>
    </Stack>
  );
};

export default ImageErrorRenderer;
