import React from 'react';

type SetState<T> = React.Dispatch<React.SetStateAction<T>>;

export const ReverseContext = React.createContext<boolean>(false);
export const useReverse = () => React.useContext(ReverseContext);
export const SetReverseContext = React.createContext<SetState<boolean>>({} as any);
export const useSetReverse = () => React.useContext(SetReverseContext);
export const SetSortContext = React.createContext<SetState<string>>({} as any);
export const useSetSort = () => React.useContext(SetSortContext);
export const SortContext = React.createContext<string>('Alphabetical');
export const useSort = () => React.useContext(SortContext);
