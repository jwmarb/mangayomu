'use client';
import React from 'react';
import Link from 'next/link';
import { useRealm } from '@app/context/realm';

const Home: React.FC = (props) => {
  const realm = useRealm();
  return (
    <div>
      <h1>Hello World</h1>
      hi
    </div>
  );
};

export default Home;
