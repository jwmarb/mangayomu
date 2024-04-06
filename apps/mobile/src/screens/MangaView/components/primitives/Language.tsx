import Chip from '@/components/primitives/Chip';
import Icon from '@/components/primitives/Icon';
import useLanguage from '@/screens/MangaView/hooks/useLanguage';

export type LanguageProps = {
  language: string;
};

export default function Language({ language }: LanguageProps) {
  const [name, iconProps] = useLanguage(language);
  return <Chip icon={<Icon {...iconProps} />} title={name} />;
}
