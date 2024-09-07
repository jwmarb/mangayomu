import Switch from '@/components/primitives/Switch';
import MiscellaneousOption from '@/screens/ReaderSettings/components/primitives/MiscellaneousOption';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({}));

export default function FetchAhead() {
  return (
    <MiscellaneousOption>
      <MiscellaneousOption.Title
        title="Fetch Ahead"
        description="Fetches the next chapter when you reach a certain point in the current one."
      />
      <MiscellaneousOption.Content>
        <Switch />
      </MiscellaneousOption.Content>
    </MiscellaneousOption>
  );
}
