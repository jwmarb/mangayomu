import React from 'react';

const Home: React.FC = () => {
  return <div>{process.env.VERCEL_ENV}</div>;
};

export default Home;
