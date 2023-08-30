import { ModalMethods } from '@app/components/Modal';
import Text from '@app/components/Text';
import React from 'react';
import { useButton } from 'react-aria';
const Modal = React.lazy(() => import('@app/components/Modal'));
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
  const { title, value, icon, top, bottom, first, options } = props;
  const modalRef = React.useRef<ModalMethods>(null);
  const btnRef = React.useRef<HTMLButtonElement>(null);
  function handleOnPress() {
    modalRef.current?.open();
  }
  const { buttonProps } = useButton(
    { elementType: 'button', onPress: handleOnPress },
    btnRef,
  );
  return (
    <>
      <button
        {...buttonProps}
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
        <Modal ref={modalRef} className="flex flex-col gap-2" title={title}>
          {Object.values(options).map((x) => (
            <div className="flex flex-row gap-4" key={x}>
              <Text component="label">{x}</Text>
            </div>
          ))}
        </Modal>
      </React.Suspense>
    </>
  );
}
