import languages, { Languages } from '@mangayomu/language-codes';
import { IconProps } from '@/components/primitives/Icon';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const FLAG_WIDTH = 20;
const FLAG_HEIGHT = 15;

const styles = createStyles((theme) => ({
  flag: {
    width: FLAG_WIDTH,
    height: FLAG_HEIGHT,
  },
}));

const iconProps: IconProps = { type: 'icon', name: 'flag-variant' };

function isLanguage(x: string): x is keyof Languages {
  return x in languages;
}

export default function useLanguage(
  language?: string | null,
): [string, IconProps] {
  const contrast = useContrast();
  const style = useStyles(styles, contrast);
  if (language == null || !isLanguage(language))
    return [language ?? 'unknown', iconProps];
  const lang = languages[language];
  if ('flag' in lang === false) return [lang.name, iconProps];

  return [
    lang.name,
    {
      type: 'image',
      uri: `https://flagcdn.com/${FLAG_WIDTH}x${FLAG_HEIGHT}/${lang.flag}.png`,
      style: style.flag,
    },
  ];
}
