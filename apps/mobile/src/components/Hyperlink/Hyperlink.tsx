import Text from '@components/Text';
import React from 'react';
import { Linking } from 'react-native';
import { TouchableWithoutFeedback } from 'react-native-gesture-handler';
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
    <TouchableWithoutFeedback onPress={handleOnPress}>
      <Text color="hint" underline={underline} {...rest}>
        {children}
      </Text>
    </TouchableWithoutFeedback>
  );
};

export default Hyperlink;
