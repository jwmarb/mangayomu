import Accordion from '@components/Accordion';
import Box from '@components/Box';
import Button from '@components/Button';
import Stack from '@components/Stack';
import Text from '@components/Text';
import { ScrollView } from 'react-native-gesture-handler';
import { useSafeAreaInsets } from 'react-native-safe-area-context';

interface ErrorFallbackProps {
  error: Error;
  resetError(): void;
}

export default function ErrorFallback(props: ErrorFallbackProps) {
  const { error, resetError } = props;
  const { top } = useSafeAreaInsets();
  function handleOnPress() {
    resetError();
  }
  return (
    <ScrollView contentContainerStyle={{ minHeight: '100%' }}>
      <Stack
        space="s"
        pt={top}
        mx="m"
        my="xl"
        background-color="paper"
        flex-direction="column"
        justify-content="center"
      >
        <Text variant="header" bold>
          The application has crashed!
        </Text>
        <Text color="textSecondary">
          There was an error that this application could not catch. For
          debugging purposes, we have provided the error.
        </Text>

        <Accordion title="Message">
          <Text color="error">{error.message}</Text>
        </Accordion>

        <Accordion title="Stack" defaultState="collapsed">
          <Text color="error" variant="body-sub">
            {error.stack}
          </Text>
        </Accordion>
        <Button
          label="Restart Application"
          onPress={handleOnPress}
          variant="contained"
        />
      </Stack>
    </ScrollView>
  );
}
