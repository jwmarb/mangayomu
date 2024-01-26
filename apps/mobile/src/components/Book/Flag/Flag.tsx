import Badge, { BadgeLocation } from '@components/Badge';
import languages, { ISOLangCode } from '@mangayomu/language-codes';
import { ScaledSheet, moderateScale } from 'react-native-size-matters';

const styles = ScaledSheet.create({
  flag: {
    width: '20@ms',
    height: '11@ms',
  },
});

const placementOffset = {
  t: moderateScale(18),
};

export default function Flag(
  props: React.PropsWithChildren<{
    language?: ISOLangCode | null;
  }>,
) {
  const { children, language } = props;

  if (language == null) return <>{children}</>;

  const lang = languages[language];

  const uri =
    lang != null && 'flag' in lang
      ? `https://flagcdn.com/w40/${lang.flag}.png`
      : null;

  if (uri == null) return <>{children}</>;

  return (
    <Badge
      type="image"
      uri={uri}
      style={styles.flag}
      show
      placement={BadgeLocation.TOP_RIGHT}
      placementOffset={placementOffset}
    >
      {children}
    </Badge>
  );
}
