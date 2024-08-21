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

test('handles a function that returns an empty object', async () => {
  const [lightStyles, darkStyles] = createStyles((theme) => ({}));

  expect(lightStyles).toEqual({});
  expect(darkStyles).toEqual({});
});

test('handles a function that returns null or undefined', async () => {
  const [lightStyles, darkStyles] = createStyles(() => null);

  expect(lightStyles).toBeNull();
  expect(darkStyles).toBeNull();
});

test('integrates theme into props with multiple styles', () => {
  const [lightProps, darkProps] = createThemedProps((theme) => ({
    style1: {
      color: (theme as unknown as MockTheme).text,
    },
    style2: {
      backgroundColor: (theme as unknown as MockTheme).text,
    },
  }));

  expect(lightProps).toEqual({
    style1: { color: TEXT_LIGHT_COLOR },
    style2: { backgroundColor: TEXT_LIGHT_COLOR },
  });
  expect(darkProps).toEqual({
    style1: { color: TEXT_DARK_COLOR },
    style2: { backgroundColor: TEXT_DARK_COLOR },
  });
});

test('handles a function that returns a complex object', async () => {
  const [lightStyles, darkStyles] = createStyles((theme) => ({
    myStyle: {
      color: (theme as unknown as MockTheme).text,
      fontSize: 20,
    },
  }));

  expect(lightStyles).toEqual({
    myStyle: {
      color: TEXT_LIGHT_COLOR,
      fontSize: 20,
    },
  });
  expect(darkStyles).toEqual({
    myStyle: {
      color: TEXT_DARK_COLOR,
      fontSize: 20,
    },
  });
});

test('handles a function that returns an array', async () => {
  const [lightStyles, darkStyles] = createStyles((theme) => [
    {
      color: (theme as unknown as MockTheme).text,
    },
    {
      backgroundColor: (theme as unknown as MockTheme).text,
    },
  ]);

  expect(lightStyles).toEqual([
    { color: TEXT_LIGHT_COLOR },
    { backgroundColor: TEXT_LIGHT_COLOR },
  ]);
  expect(darkStyles).toEqual([
    { color: TEXT_DARK_COLOR },
    { backgroundColor: TEXT_DARK_COLOR },
  ]);
});
