import Text from '@app/components/Text';
import { animated } from '@react-spring/web';
import React from 'react';
import { MdImage, MdMenuBook, MdSearch } from 'react-icons/md';
type BottomOverlayProps = React.ComponentProps<typeof animated.div>;

function BottomOverlay(
  props: BottomOverlayProps,
  ref: React.ForwardedRef<HTMLDivElement>,
) {
  const { style } = props;
  return (
    <animated.div
      ref={ref}
      style={style}
      className="grid grid-cols-3 fixed left-0 right-0 bottom-0 bg-reader-overlay w-full z-10"
    >
      <button className="transition duration-250 active:bg-pressed hover:bg-hover outline-none p-4 flex items-center justify-center">
        <MdSearch className="text-2xl text-overlay-primary" />
      </button>
      <button className="transition duration-250 active:bg-pressed hover:bg-hover outline-none p-4 flex items-center justify-center">
        <MdImage className="text-2xl text-overlay-primary" />
      </button>
      <button className="transition duration-250 active:bg-pressed hover:bg-hover outline-none p-4 flex items-center justify-center">
        <MdMenuBook className="text-2xl text-overlay-primary" />
      </button>
    </animated.div>
  );
}

export default React.forwardRef(BottomOverlay);
