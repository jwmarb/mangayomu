'use client';
import { ModalMethods } from '@app/components/Modal';
import Radio from '@app/components/Radio';
import { RadioMethods } from '@app/components/Radio/radio';
import Text from '@app/components/Text';
import React from 'react';
import { useButton } from 'react-aria';
const Modal = React.lazy(() => import('@app/components/Modal'));
interface ReaderOptionProps<T extends string> {
  icon: React.ReactElement<{ className: string }>;
  options: Record<string, T>;
  onChange: (newVal: T) => void;
  title: string;
  value: T;
  top?: boolean;
  first?: boolean;
  bottom?: boolean;
}

export default function Option<T extends string>(props: ReaderOptionProps<T>) {
  const {
    title,
    value,
    icon,
    top,
    bottom,
    first,
    options,
    onChange: _onChange,
  } = props;
  const modalRef = React.useRef<ModalMethods>(null);
  function handleOnPress() {
    modalRef.current?.open();
  }
  const onChange = React.useCallback(
    (newVal: T) => {
      _onChange(newVal);
      modalRef.current?.close();
    },
    [_onChange],
  );

  return (
    <>
      <button
        onClick={handleOnPress}
        className={
          (bottom ? 'border-b-2 border-default rounded-b-lg ' : '') +
          (top ? 'border-t-2 border-default ' : '') +
          (first ? 'rounded-t-lg ' : '') +
          'hover:bg-hover active:bg-pressed transition duration-250 flex flex-row w-full items-center p-3 bg-paper gap-5 border-l-2 border-r-2'
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
      <React.Suspense>
        <Radio.Group selected={value} onChange={onChange}>
          <Modal ref={modalRef} className="flex flex-col" title={title}>
            {Object.values(options).map((x) => (
              <OptionValue value={x} key={x} />
            ))}
          </Modal>
        </Radio.Group>
      </React.Suspense>
    </>
  );
}

type OptionValueProps<T extends string> = {
  value: T;
};

function OptionValue<T extends string>(props: OptionValueProps<T>) {
  const { value } = props;
  const ref = React.useRef<RadioMethods>(null);

  return (
    <span
      onClick={() => ref.current?.toggle()}
      className="p-3 active:bg-pressed hover:bg-hover transition duration-150"
    >
      <Radio ref={ref} value={value} label={value} />
    </span>
  );
}
