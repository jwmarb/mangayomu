import { Button, Flex, Typography } from '@components/core';
import ProgressDot from '@screens/Welcome/components/Presentation/ProgressDot';
import { PresentationProps } from '@screens/Welcome/components/Presentation/Presentation.interfaces';
import React from 'react';

const Presentation: React.FC<PresentationProps> = (props) => {
  const { screens, index, onNextScreen, onPreviousScreen, onFinish } = props;
  function handleOnNextScreen() {
    if (screens.length - 1 > index) onNextScreen(index + 1);
  }
  function handleOnPreviousScreen() {
    if (index > 0) onPreviousScreen(index - 1);
  }

  const Slide = React.useMemo(() => screens[index], [index]);

  return (
    <>
      <Flex grow growMax='70%' direction='column' justifyContent='flex-end' alignItems='center'>
        <Slide />
        <Flex grow growMax='10%' direction='column' alignItems='center' justifyContent='center'>
          <Flex spacing={1}>
            {screens.map((_, i) => (
              <ProgressDot key={i} selected={i === index} />
            ))}
          </Flex>
        </Flex>
      </Flex>
      <Flex
        alignItems='center'
        justifyContent={index > 0 ? 'space-between' : index < screens.length - 1 ? 'flex-end' : 'flex-start'}>
        {index > 0 && <Button title='Back' onPress={handleOnPreviousScreen} />}
        {index < screens.length - 1 && <Button title='Next' onPress={handleOnNextScreen} />}
        {index === screens.length - 1 && <Button title='Start Reading' variant='contained' onPress={onFinish} />}
      </Flex>
    </>
  );
};

export default Presentation;
