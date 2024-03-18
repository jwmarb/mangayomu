import type { SectionListData } from 'react-native';

/* eslint-disable @typescript-eslint/no-explicit-any */
declare global {
  export type RenderSectionHeader<Item, Section> = (info: {
    section: SectionListData<Item, Section>;
  }) => React.ReactElement<
    any,
    string | React.JSXElementConstructor<any>
  > | null;
}

export {};
