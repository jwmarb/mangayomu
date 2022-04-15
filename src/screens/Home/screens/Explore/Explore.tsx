import Screen from '@components/Screen';
import Genres from '@screens/Home/screens/Explore/components/Genres';
import React from 'react';

const Explore: React.FC = (props) => {
  return (
    <Screen>
      <Genres />
    </Screen>
  );
};

export default Explore;
