import useClassName, { OverrideClassName } from '@app/hooks/useClassName';
import React from 'react';
import { AriaButtonProps, useButton } from 'react-aria';
import { MdCheck } from 'react-icons/md';

const HighlightContext = React.createContext<{
  selected: boolean;
  borderUnselected?: string;
} | null>(null);

interface HighlightProps extends OverrideClassName, React.PropsWithChildren {
  selected?: boolean;
  borderUnselected?: string;
}

function Highlight(props: HighlightProps) {
  const {
    borderUnselected = 'border-default',
    selected = false,
    children,
  } = props;
  const className = useClassName('relative', props);
  return (
    <div className={className}>
      {selected && (
        <MdCheck className="w-5 h-5 p-0.5 rounded-full bg-primary text-primary-contrast absolute -top-2 -right-2" />
      )}
      <HighlightContext.Provider value={{ borderUnselected, selected }}>
        {children}
      </HighlightContext.Provider>
    </div>
  );
}

const useHighlight = () => {
  const ctx = React.useContext(HighlightContext);
  if (ctx == null)
    throw new Error(
      'Cannot call HighlightContext without Highlight as a parent component',
    );
  return ctx;
};

interface BoundsProps
  extends OverrideClassName,
    React.PropsWithChildren,
    AriaProps<HTMLButtonElement, AriaButtonProps> {}

function Bounds(props: BoundsProps) {
  const { children, ...rest } = props;
  const ref = React.useRef<HTMLButtonElement>(null);
  const { selected, borderUnselected } = useHighlight();
  const className = useClassName(
    `border-2 ${selected ? 'border-primary' : borderUnselected} outline-none`,
    props,
  );
  const { buttonProps } = useButton(
    {
      ...rest,
      elementType: 'button',
    },
    ref,
  );
  return (
    <button {...buttonProps} ref={ref} className={className}>
      {children}
    </button>
  );
}

Highlight.Bounds = Bounds;

export default Highlight;
