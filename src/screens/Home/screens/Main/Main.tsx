import Screen from '@components/Screen';
import { Typography } from '@components/Typography';
import MangaSee from '@services/MangaSee';
import React from 'react';

const Main: React.FC = (props) => {
  React.useEffect(() => {
    (async () => {
      console.log('fetching request');
      const t = await MangaSee.listMangas();
      console.log(t ? t[1000] : null);
    })();
  }, []);
  return (
    <Screen>
      <Typography>Hello World</Typography>
    </Screen>
  );
};

export default Main;
