'use client';
import { useListAccordionHeader } from '@app/components/List/accordion';
import Text from '@app/components/Text';
import useBoolean from '@app/hooks/useBoolean';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import { animated, useSpring } from '@react-spring/web';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';

interface ListHeaderProps extends React.PropsWithChildren {
  icon?: React.ReactNode;
}

function BaseComponent(
  props: React.PropsWithChildren<{ className: string; onClick: () => void }>,
) {
  const ctx = useListAccordionHeader();

  if (ctx == null) return <div {...props} />;
  return <button {...props}></button>;
}

export default function ListHeader(props: ListHeaderProps) {
  const { children, icon } = props;
  const ctx = useListAccordionHeader();

  if (icon)
    return (
      <BaseComponent
        onClick={() => ctx && ctx[1]()}
        className="flex flex-row justify-between items-center py-1.5"
      >
        <Text
          variant="list-header"
          color="hint"
          className="text-start py-1.5 select-none hover:text-white flex-grow"
        >
          {children}
        </Text>
        <div className="relative">
          <div className="absolute top-0 bottom-0 right-0 bg-red-500 flex items-center mr-4">
            {icon}
          </div>
          {ctx && (
            <animated.div
              style={{
                transform: ctx[0].to((val) => `rotate(${val}deg)`),
              }}
              className="absolute top-0 right-0 bottom-0 pointer-events-none flex items-center"
            >
              <MdChevronRight className="text-hint w-4 h-4" />
            </animated.div>
          )}
        </div>
      </BaseComponent>
    );
  return (
    <BaseComponent
      onClick={() => ctx && ctx[1]()}
      className="outline-none flex flex-row space-x-1 items-center w-full relative"
    >
      <Text
        variant="list-header"
        color="hint"
        className="text-start py-1.5 select-none hover:text-white flex-grow"
      >
        {children}
      </Text>
      {ctx && (
        <animated.div
          style={{
            transform: ctx[0].to((val) => `rotate(${val}deg)`),
          }}
          className="absolute top-0 right-0 bottom-0 pointer-events-none flex items-center"
        >
          <MdChevronRight className="text-hint w-4 h-4" />
        </animated.div>
      )}
    </BaseComponent>
  );
}
