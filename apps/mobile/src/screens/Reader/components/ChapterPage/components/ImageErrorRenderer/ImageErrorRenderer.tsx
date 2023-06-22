import React from 'react';
import { ImageErrorRendererProps } from './ImageErrorRenderer.interfaces';
import Stack from '@components/Stack';
import Icon from '@components/Icon';
import Hyperlink from '@components/Hyperlink';
import Button from '@components/Button';
import Text from '@components/Text';
import { moderateScale } from 'react-native-size-matters';

const ImageErrorRenderer: React.FC<ImageErrorRendererProps> = (props) => {
  const { style, onReload, pageKey } = props;
  return (
    <Stack
      style={style}
      space="s"
      position="absolute"
      align-items="center"
      flex-grow
      top={0}
      left={0}
      right={0}
      bottom={0}
      justify-content="center"
      px="m"
    >
      <Icon
        type="font"
        name="wifi-alert"
        color="textSecondary"
        size={moderateScale(128)}
      />
      <Text align="center">There was an error loading this page.</Text>
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
