import { createStyles, createThemedProps } from '@/utils/theme';

export type MockTheme = {
  text: string;
};

jest.mock('../../hooks/useIsDarkMode', () => jest.fn());

const TEXT_LIGHT_COLOR = '#000000';
const TEXT_DARK_COLOR = '#ffffff';
jest.mock('../../providers/theme', () => ({
  lightTheme: { text: TEXT_LIGHT_COLOR },
  darkTheme: { text: TEXT_DARK_COLOR },
}));

test('splits styles into dark/light counterparts', async () => {
  const [lightStyles, darkStyles] = createStyles((theme) => {
    return {
      myTextStyle: {
        color: (theme as unknown as MockTheme).text,
      },
    };
  });

  expect(lightStyles).toEqual({ myTextStyle: { color: TEXT_LIGHT_COLOR } });
  expect(darkStyles).toEqual({ myTextStyle: { color: TEXT_DARK_COLOR } });
});

test('integrates theme into props', () => {
  const [lightProps, darkProps] = createThemedProps((theme) => ({
    style: {
      color: (theme as unknown as MockTheme).text,
    },
  }));

  expect(lightProps).toEqual({ style: { color: TEXT_LIGHT_COLOR } });
  expect(darkProps).toEqual({ style: { color: TEXT_DARK_COLOR } });
});
