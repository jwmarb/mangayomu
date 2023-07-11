'use client';
import React from 'react';
import Text from '@app/components/Text';
import { GiBookshelf } from 'react-icons/gi';
import Button from '@app/components/Button';
import Screen from '@app/components/Screen';
import { useAddedSources } from '@app/context/sources';
import NoSelectedSources from '@app/(root)/components/noselectedsources';
import Explore from '@app/(root)/components/explore';

const Home: React.FC = () => {
  const sources = useAddedSources((store) => store.sources);

  return (
    <Screen>{sources.length > 0 ? <Explore /> : <NoSelectedSources />}</Screen>
  );
};

export default Home;
