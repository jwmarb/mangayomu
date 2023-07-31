'use client';
import React from 'react';
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
