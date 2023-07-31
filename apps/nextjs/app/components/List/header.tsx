'use client';
import { useListAccordionHeader } from '@app/components/List/accordion';
import Text from '@app/components/Text';
import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import { animated } from '@react-spring/web';
import React from 'react';
import { MdChevronRight } from 'react-icons/md';

interface ListHeaderProps extends React.PropsWithChildren {
  icon?: React.ReactNode;
  badge?: number;
}

function BaseComponent(
  props: React.PropsWithChildren<{ onClick: () => void } & OverrideClassName>,
) {
  const className = useClassName('cursor-pointer', props);
  const ctx = useListAccordionHeader();

  if (ctx == null) return <div {...props} />;
  return <div {...props} className={className} />;
}

export default function ListHeader(props: ListHeaderProps) {
  const { children, badge, icon } = props;
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
          className={`text-start py-1.5 select-none ${
            ctx ? 'hover:text-black hover:dark:text-white' : ''
          } flex flex-row flex-grow items-center`}
        >
          {children}
          {badge && (
            <Text
              component="span"
              variant="sm-badge"
              color="hint"
              className="ml-2 w-[1.125rem] h-[1.125rem] rounded-full flex items-center justify-start"
            >
              ({badge})
            </Text>
          )}
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
        className={`text-start py-1.5 select-none ${
          ctx ? 'hover:text-black hover:dark:text-white' : ''
        } flex-grow flex flex-row items-center`}
      >
        {children}
        {badge && (
          <Text
            component="span"
            variant="sm-badge"
            color="hint"
            className="ml-2 w-[1.125rem] h-[1.125rem] rounded-full flex items-center justify-start"
          >
            ({badge})
          </Text>
        )}
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
