import React from 'react';

export const ErrorContext = React.createContext<string>('');

export const useMangaViewError = () => React.useContext(ErrorContext);
