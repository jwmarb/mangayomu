import Screen from '@app/components/Screen';
import Text from '@app/components/Text';

export default function EmptyHistory() {
  return (
    <>
      <Text variant="header-emphasized" className="text-center">
        Your history is empty
      </Text>
      <span className="flex flex-row">
        <Text color="text-secondary" className="text-center">
          You have no entries in your history. Every manga you read will be
          shown here.
        </Text>
      </span>
    </>
  );
}
