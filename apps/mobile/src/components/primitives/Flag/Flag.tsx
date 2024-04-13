import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { ImageStyle, StyleProp } from 'react-native';
import { FLAG_ACTUAL_WIDTH } from '@/components/primitives/Flag';
import { styles } from '@/components/primitives/Flag/styles';
import Icon from '@/components/primitives/Icon';
import Image from '@/components/primitives/Image';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';

export type FlagProps = {
  // eslint-disable-next-line @typescript-eslint/ban-types
  language?: ISOLangCode | (string & {});
  contrast?: boolean;
  style?: StyleProp<ImageStyle>;
};

function isLanguage(x: string): x is ISOLangCode {
  return x in languages;
}

/**
 * `Flag` is a component that displays the flag of a nation whose main spoken language matches that of the `language`
 * prop. The flags are from [flagcdn](https://flagcdn.com/)
 *
 * If the flag is unknown or does not exist, the flag displayed will be a white flag
 */
export default function Flag(props: FlagProps) {
  const { contrast: contrastProp, language, style: styleProp } = props;
  const contrast = useContrast(contrastProp);
  const style = useStyles(styles, contrast);

  if (language == null || !isLanguage(language)) {
    return <Icon type="icon" name="flag" style={styleProp} />;
  }
  const lang = languages[language];

  if ('flag' in lang === false) {
    return <Icon type="icon" name="flag" style={styleProp} />;
  }

  const imageStyle = [style.flag, styleProp];
  const source = {
    uri: `https://flagcdn.com/w${FLAG_ACTUAL_WIDTH}/${lang.flag}.png`,
  };

  return <Image style={imageStyle} source={source} />;
}
