import Highlight from '@app/(root)/settings/components/highlight';
import Text from '@app/components/Text';
import {
  BackgroundColor,
  useReaderSettings,
} from '@app/context/readersettings';
import React from 'react';
import shallow from 'zustand/shallow';

function _BackgroundColor() {
  const [bg, setBg] = useReaderSettings(
    (store) => [store.backgroundColor, store.setBackgroundColor],
    shallow,
  );
  return (
    <div className="mx-4 p-4 rounded-xl border-2 border-default bg-paper flex md:flex-row flex-col md:justify-between md:items-center gap-4">
      <div>
        <Text>Background color</Text>
        <Text color="text-secondary" variant="sm-label">
          Sets the background color while reading
        </Text>
      </div>
      <div className="flex flex-row gap-2 self-center">
        {Object.values(BackgroundColor).map((x) => (
          <Highlight
            key={x}
            selected={bg === x}
            className="w-12 h-12"
            borderUnselected={
              x === BackgroundColor.BLACK ? 'border-default-light' : undefined
            }
          >
            <Highlight.Bounds
              className={`w-12 h-12 ${x} rounded-xl`}
              onPress={() => setBg(x)}
            />
          </Highlight>
        ))}
      </div>
    </div>
  );
}

export default React.memo(_BackgroundColor);
