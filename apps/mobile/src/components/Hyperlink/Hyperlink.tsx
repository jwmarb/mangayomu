import Text from '@components/Text';
import React from 'react';
import { Linking, Pressable } from 'react-native';
import { HyperlinkProps } from './Hyperlink.interfaces';

const Hyperlink: React.FC<HyperlinkProps> = (props) => {
  const { url, children, underline = true, ...rest } = props;
  async function handleOnPress() {
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) await Linking.openURL(url);
    } catch (e) {
      console.error(e);
    }
  }
  return (
    <Pressable onPress={handleOnPress}>
      <Text color="hint" underline={underline} {...rest}>
        {children}
      </Text>
    </Pressable>
  );
};

export default Hyperlink;
