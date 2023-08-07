import Highlight from '@app/(root)/settings/components/highlight';
import Text from '@app/components/Text';
import { MdArrowRightAlt } from 'react-icons/md';
import { ReadingDirection as Direction } from '@mangayomu/schemas';
import { useReaderSettings } from '@app/context/readersettings';
import { shallow } from 'zustand/shallow';
import React from 'react';

const Icons: Record<Direction, React.FC<{ selected?: boolean }>> = {
  [Direction.LEFT_TO_RIGHT]: ({ selected }) => (
    <div className="relative h-9">
      <div className="flex flex-row gap-0.5">
        <div className="w-2 h-6 border-b-2 border-r-2 border-t-2 rounded-r border-text-primary" />
        <div className="w-2 h-6 border-b-2 border-l-2 border-t-2 rounded-l border-text-primary" />
      </div>
      <MdArrowRightAlt
        className={`absolute top-4 right-[-50%] translate-x[-50%] ${
          selected ? 'text-primary' : 'text-hint'
        } w-8 h-8`}
      />
    </div>
  ),
  [Direction.RIGHT_TO_LEFT]: ({ selected }) => (
    <div className="relative h-9">
      <div className="flex flex-row gap-0.5">
        <div className="w-2 h-6 border-b-2 border-r-2 border-t-2 rounded-r border-text-primary" />
        <div className="w-2 h-6 border-b-2 border-l-2 border-t-2 rounded-l border-text-primary" />
      </div>
      <MdArrowRightAlt
        className={`absolute top-4 left-[50%] right-[50%] translate-x-[-50%] ${
          selected ? 'text-primary' : 'text-hint'
        } w-8 h-8 rotate-180`}
      />
    </div>
  ),
  [Direction.VERTICAL]: ({ selected }) => (
    <div className="flex flex-row-reverse items-center">
      <div className="flex flex-col gap-0.5">
        <div className="w-6 h-3.5 border-l-2 border-r-2 border-b-2 rounded-b border-text-primary" />
        <div className="w-6 h-3.5 border-l-2 border-r-2 border-t-2 rounded-t border-text-primary" />
      </div>
      <MdArrowRightAlt
        className={`${
          selected ? 'text-primary' : 'text-hint'
        } w-6 h-6 rotate-90`}
      />
    </div>
  ),
  [Direction.WEBTOON]: ({ selected }) => (
    <div className="flex flex-row-reverse items-center">
      <div className="w-6 h-8 border-l-2 border-r-2 border-text-primary flex items-center">
        <div className="w-full h-0.5 bg-text-primary" />
      </div>
      <MdArrowRightAlt
        className={`${
          selected ? 'text-primary' : 'text-hint'
        } w-6 h-6 rotate-90`}
      />
    </div>
  ),
};

function ReadingDirection() {
  const [rd, setRd] = useReaderSettings(
    (store) => [store.readingDirection, store.setReadingDirection],
    shallow,
  );
  return (
    <div className="p-4 mx-4 bg-paper border-2 rounded-xl border-default flex flex-col gap-4">
      <Text>Reading direction</Text>
      <div className="grid grid-cols-2 gap-4">
        {Object.values(Direction).map((x) => (
          <Highlight selected={x === rd} key={x} className="flex flex-grow">
            <Highlight.Bounds
              onPress={() => setRd(x)}
              className="flex flex-grow hover:bg-hover active:bg-pressed transition duration-250 items-center flex-col p-2 border-2 rounded bg-default justify-between"
            >
              {React.createElement(Icons[x], { selected: x === rd })}
              <Text
                color={x === rd ? 'primary' : 'text-secondary'}
                className="select-none"
              >
                {x}
              </Text>
            </Highlight.Bounds>
          </Highlight>
        ))}
      </div>
    </div>
  );
}

export default React.memo(ReadingDirection);
