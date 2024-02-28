import Box from '@components/Box';
import Text from '@components/Text';
import { TextProps } from '@components/Text/Text.interfaces';
import { TextProperty } from '@mangayomu/schema-creator';
import React from 'react';
import { DescriptionProps } from './Description.interfaces';

function toTextProps(r: TextProperty): TextProps {
  if (typeof r === 'string') throw Error('String not allowed');
  return {
    bold: r.bold,
    italic: r.italic,
    color: r.color ?? 'textSecondary',
  };
}

const Description: React.FC<DescriptionProps> = (props) => {
  const { description } = props;
  if (typeof description === 'string')
    return (
      <Box mx="m">
        <Text color="textSecondary">{description}</Text>
      </Box>
    );
  if (
    typeof description === 'object' &&
    description != null &&
    !Array.isArray(description)
  )
    return (
      <Box mx="m">
        <Text {...toTextProps(description)}>{description.text}</Text>
      </Box>
    );
  return (
    <Box mx="m">
      {description.map((line, i) => {
        if (typeof line === 'string')
          return (
            <Text key={i} color="textSecondary">
              {line}
            </Text>
          );
        if (typeof line === 'object' && line != null && !Array.isArray(line))
          return (
            <Text key={i} {...toTextProps(line)}>
              {line.text}
            </Text>
          );
        return (
          <Text key={i} color="textSecondary">
            {line.map((text, i) => {
              if (typeof text === 'string') return text;
              return (
                <Text key={i} {...toTextProps(text)}>
                  {text.text}
                </Text>
              );
            })}
          </Text>
        );
      })}
    </Box>
  );
};

export default React.memo(Description);
