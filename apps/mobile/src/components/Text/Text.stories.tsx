import Text from './Text';
import React from 'react';
import { storiesOf } from '@storybook/react-native';
import { ScrollView } from 'react-native';
import { typography } from '@theme/theme';

storiesOf('Text', module)
  .addDecorator((story) => <ScrollView>{story()}</ScrollView>)
  .add('Typography', () => (
    <>
      {Object.keys(typography).map((x) => (
        <Text variant={x as keyof typeof typography} key={x}>
          {x}
        </Text>
      ))}
    </>
  ));
