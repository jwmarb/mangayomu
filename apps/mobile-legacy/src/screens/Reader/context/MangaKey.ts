import React from 'react';

export const MangaKeyContext = React.createContext<string | null>(null);

export const useMangaKey = () => React.useContext(MangaKeyContext);
