import Icon from '@components/Icon';
import Switch from '@components/Switch';
import PressableListItem from '@screens/More/components/PressableListItem';
import React from 'react';
import connector, { ConnectedCloudSwitchProps } from './CloudSwitch.redux';

const CloudSwitch: React.FC<ConnectedCloudSwitchProps> = (props) => {
  const { toggleCloudSync, cloudSyncEnabled } = props;
  const handleOnPress = React.useCallback(() => {
    toggleCloudSync();
  }, [toggleCloudSync]);
  return (
    <PressableListItem
      onPress={handleOnPress}
      label="Enable Cloud"
      iconLeft={<Icon type="font" name="cloud" />}
      iconRight={
        <Switch enabled={cloudSyncEnabled} onChange={toggleCloudSync} />
      }
    />
  );
};

export default connector(React.memo(CloudSwitch));
