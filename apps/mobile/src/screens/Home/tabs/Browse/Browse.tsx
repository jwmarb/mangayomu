import Icon from '@/components/primitives/Icon';
import Screen from '@/components/primitives/Screen';
import TextInput from '@/components/primitives/TextInput';
import useCollapsibleHeader from '@/hooks/useCollapsibleHeader';

export default function Browse() {
  const collapsible = useCollapsibleHeader({
    showHeaderLeft: false,
    showHeaderRight: false,
    headerCenter: (
      <TextInput
        placeholder="Search for a manga..."
        icon={<Icon type="icon" name="magnify" />}
      />
    ),
  });
  return <Screen collapsible={collapsible}></Screen>;
}
