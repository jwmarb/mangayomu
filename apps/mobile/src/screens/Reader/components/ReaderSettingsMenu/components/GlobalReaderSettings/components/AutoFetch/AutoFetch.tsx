import React from 'react';
import connector, { ConnectedAutoFetchProps } from './AutoFetch.redux';
import Stack from '@components/Stack/Stack';
import Box from '@components/Box/Box';
import Text from '@components/Text/Text';
import { AutoFetchThreshold, AutoFetchType } from '@redux/slices/settings';
import { useTheme } from '@emotion/react';
import ModalMenu from '@components/ModalMenu/ModalMenu';
import { DIVIDER_DEPTH } from '@theme/constants';
import ModalInput from '@components/ModalInput/ModalInput';
import {
  NativeSyntheticEvent,
  Pressable,
  TextInputSubmitEditingEventData,
} from 'react-native';

const AutoFetch: React.FC<ConnectedAutoFetchProps> = (props) => {
  const {
    autoFetchType,
    thresholdPosition,
    pageThreshold,
    setAutoFetch,
    setAutoFetchThresholdPosition,
    setAutoFetchPageThreshold,
  } = props;
  const theme = useTheme();
  function handleOnSubmitEditing(
    e: NativeSyntheticEvent<TextInputSubmitEditingEventData>,
  ) {
    const parsed = parseInt(e.nativeEvent.text);
    if (Number.isInteger(parsed)) setAutoFetchPageThreshold(parsed);
  }
  return (
    <>
      <ModalMenu
        trigger={
          <Pressable android_ripple={{ color: theme.palette.action.ripple }}>
            <Stack
              align-items="center"
              flex-direction="row"
              space="s"
              justify-content="space-between"
              p="m"
            >
              <Box flex-shrink>
                <Text>Use Auto Fetch</Text>
                <Text color="textSecondary" variant="body-sub">
                  Automatically fetch the next chapter every time a chapter is
                  opened
                </Text>
              </Box>

              <Text color="primary" bold variant="button">
                {autoFetchType}
              </Text>
            </Stack>
          </Pressable>
        }
        title="Use Auto Fetch"
        enum={AutoFetchType}
        value={autoFetchType}
        onChange={setAutoFetch}
      />
      {autoFetchType !== AutoFetchType.NEVER && (
        <Stack
          border-width={{ l: DIVIDER_DEPTH }}
          border-color="@theme"
          flex-grow
          ml="m"
        >
          <ModalMenu
            trigger={
              <Pressable
                android_ripple={{ color: theme.palette.action.ripple }}
              >
                <Stack
                  flex-direction="row"
                  space="s"
                  align-items="center"
                  justify-content="space-between"
                  p="m"
                >
                  <Box flex-shrink>
                    <Text>Threshold Position</Text>
                    <Text color="textSecondary" variant="body-sub">
                      The location where the threshold should occur to initiate
                      auto fetch
                    </Text>
                  </Box>
                  <Text color="primary" bold variant="button">
                    {MAPPED_THRESHOLD_POSITION[thresholdPosition]}
                  </Text>
                </Stack>
              </Pressable>
            }
            title="Threshold Position"
            value={thresholdPosition}
            onChange={setAutoFetchThresholdPosition}
            enum={AutoFetchThreshold}
          />
          {thresholdPosition !== AutoFetchThreshold.IMMEDIATELY && (
            <ModalInput
              onSubmitEditing={handleOnSubmitEditing}
              placeholder="Enter the # of pages to trigger auto fetch"
              defaultValue={String(pageThreshold)}
              keyboardType="number-pad"
              trigger={
                <Pressable
                  android_ripple={{ color: theme.palette.action.ripple }}
                >
                  <Stack
                    flex-direction="row"
                    space="s"
                    justify-content="space-between"
                    p="m"
                  >
                    <Box flex-shrink>
                      <Text># of pages threshold</Text>
                      <Text color="textSecondary" variant="body-sub">
                        Initiate auto fetch {pageThreshold} pages{' '}
                        {thresholdPosition.toLowerCase()}
                      </Text>
                    </Box>
                    <Text color="textSecondary">{pageThreshold}</Text>
                  </Stack>
                </Pressable>
              }
              title="# of pages threshold"
            />
          )}
        </Stack>
      )}
    </>
  );
};

const MAPPED_THRESHOLD_POSITION: Record<AutoFetchThreshold, string> = {
  [AutoFetchThreshold.AT_END]: 'End',
  [AutoFetchThreshold.AT_START]: 'Start',
  [AutoFetchThreshold.IMMEDIATELY]: 'Immediately',
};

export default connector(React.memo(AutoFetch));
