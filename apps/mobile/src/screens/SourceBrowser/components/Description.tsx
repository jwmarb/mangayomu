import { Description as DescriptionSchema } from '@mangayomu/schema-creator';
import React from 'react';
import Text from '@/components/primitives/Text';
import useContrast from '@/hooks/useContrast';
import useStyles from '@/hooks/useStyles';
import { createStyles } from '@/utils/theme';

const styles = createStyles((theme) => ({
  container: {
    paddingHorizontal: theme.style.screen.paddingHorizontal,
  },
}));

type DescriptionProps = {
  description: DescriptionSchema['description'];
};

function Description(props: DescriptionProps) {
  const { description } = props;
  const contrast = useContrast();
  const style = useStyles(styles, contrast);

  if (Array.isArray(description)) {
    return (
      <>
        {description.map((x) => {
          if (Array.isArray(x)) {
            return (
              <>
                {x.map((y) => {
                  if (typeof y === 'string') {
                    return (
                      <Text key={y} style={style.container}>
                        {y}
                      </Text>
                    );
                  }
                  return (
                    <Text key={y.text} {...y} style={style.container}>
                      {y.text}
                    </Text>
                  );
                })}
              </>
            );
          }

          if (typeof x === 'string') {
            return (
              <Text key={x} style={style.container}>
                {x}
              </Text>
            );
          }

          return (
            <Text key={x.text} {...x} style={style.container}>
              {x.text}
            </Text>
          );
        })}
      </>
    );
  }

  if (typeof description === 'string')
    return <Text style={style.container}>{description}</Text>;

  return (
    <Text {...description} style={style.container}>
      {description.text}
    </Text>
  );
}

export default React.memo(Description);
