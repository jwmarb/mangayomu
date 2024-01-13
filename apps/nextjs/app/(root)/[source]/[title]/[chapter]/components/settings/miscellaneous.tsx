import BackgroundColor from '@app/(root)/settings/components/reader_components/BackgroundColor';
import ReadingDirection from '@app/(root)/settings/components/reader_components/ReadingDirection';
import Text from '@app/components/Text';

export default function Miscellaneous() {
  return (
    <div className="py-2 bg-default flex flex-col gap-2">
      <div className="mx-4">
        <Text variant="header">Miscellaneous</Text>
        <Text color="text-secondary">Customize functionality and features</Text>
      </div>
      <BackgroundColor />
      <ReadingDirection />
    </div>
  );
}
