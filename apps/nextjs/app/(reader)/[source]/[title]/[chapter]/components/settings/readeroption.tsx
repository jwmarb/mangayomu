import Text from '@app/components/Text';
import React from 'react';

interface ReaderOptionProps<T extends string> {
  icon: React.ReactElement<{ className: string }>;
  options: Record<string, T>;
  title: string;
  value: T;
  top?: boolean;
  first?: boolean;
  bottom?: boolean;
}

export default function Option<T extends string>(props: ReaderOptionProps<T>) {
  const { title, value, icon, top, bottom, first } = props;
  return (
    <button
      className={
        (bottom ? 'border-b-2 border-default rounded-b-lg ' : '') +
        (top ? 'border-t-2 border-default ' : '') +
        (first ? 'rounded-t-lg ' : '') +
        'hover:bg-hover active:bg-pressed transition duration-250 flex flex-row w-full items-center p-4 bg-paper gap-5 border-l-2 border-r-2'
      }
    >
      {React.cloneElement(icon, { className: 'w-5 h-5 text-text-primary' })}
      <div className="flex flex-col items-start">
        <Text>{title}</Text>
        <Text color="text-secondary" variant="sm-label">
          {value}
        </Text>
      </div>
    </button>
  );
}
