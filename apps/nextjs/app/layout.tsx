import { Metadata } from 'next';
import React from 'react';

export const metadata: Metadata = {
  title: 'MangaYomu',
  description: 'Read manga for free',
};

const App: React.FC<React.PropsWithChildren> = ({ children }) => {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
};

export default App;
