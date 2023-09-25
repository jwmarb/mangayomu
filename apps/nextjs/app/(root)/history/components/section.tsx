import Text from '@app/components/Text';
import { format } from 'date-fns';
import React from 'react';

export interface SectionProps {
  date: number;
}

export default function Section(props: SectionProps) {
  return (
    <Text className="font-bold px-4 py-3" color="text-secondary">
      {format(props.date, 'MMM d, yyyy')}
    </Text>
  );
}
