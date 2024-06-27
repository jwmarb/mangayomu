import { globalSetting } from '@/models/schema';
import SelectableOption from '@/screens/ReaderSettings/components/primitives/SelectableOption';
import { useMangaContext, useSetState } from '@/screens/ReaderSettings/context';

type UseGlobalSettingProps = {
  enum: { GLOBAL: typeof globalSetting };
  localState: unknown;
};
export default function UseGlobalSetting(props: UseGlobalSettingProps) {
  const { enum: Enum, localState } = props;
  const setState = useSetState();
  const manga = useMangaContext();

  if (manga != null)
    return (
      <SelectableOption
        title="Use global setting"
        value={Enum.GLOBAL}
        onSelect={setState}
        selected={localState === Enum.GLOBAL}
      />
    );
  return null;
}
