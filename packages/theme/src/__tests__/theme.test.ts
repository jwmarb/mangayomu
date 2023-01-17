import { createTheme, DefaultTheme, DefaultThemeHelpers } from '..';
jest.mock('react', () => {
  const originalImplementation = jest.requireActual('react');
  return {
    ...originalImplementation,
    // eslint-disable-next-line @typescript-eslint/no-explicit-any, @typescript-eslint/no-unused-vars
    useMemo: (i: () => any, a: any[]) => i(),
  };
});

interface TestTheme extends DefaultTheme {
  helpers: typeof helpers & DefaultThemeHelpers;
}

let theme: TestTheme;

const helpers = {
  first: () => {
    return () => {
      return 1;
    };
  },
  second: () => {
    return (theme: TestTheme) => {
      return theme.style.borderRadius * 2;
    };
  },
  withParams: (foo: string) => {
    return (theme: TestTheme) => {
      return theme.mode + ' ' + foo + 'bar';
    };
  },
};

test('Theme object created and parsed properly', () => {
  theme = createTheme<TestTheme>(({ color, colorConstant }) => ({
    mode: 'light',
    palette: {
      primary: {
        light: colorConstant('#69c0ff'),
        main: colorConstant('#1890ff'),
        dark: colorConstant('#0050b3'),
      },
      secondary: {
        light: colorConstant('#ffa39e'),
        main: colorConstant('#ff7875'),
        dark: colorConstant('#ff4d4f'),
      },
      text: {
        primary: color('rgba(255, 255, 255, 1)', 'rgba(0, 0, 0, 0.87)'),
        secondary: color('rgba(255, 255, 255, 0.7)', 'rgba(0, 0, 0, 0.6)'),
        disabled: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
        hint: color('rgba(255, 255, 255, 0.5)', 'rgba(0, 0, 0, 0.38)'),
      },
      background: {
        default: color('#141414', '#fafafa'),
        paper: color('#262626', '#ffffff'),
      },
    },
    style: {
      borderRadius: 4,
      spacing: {
        s: 2,
        m: 6,
        l: 10,
        xl: 16,
      },
    },
    helpers,
  }));

  for (const key in theme.helpers) {
    expect(theme.helpers[key as keyof typeof theme.helpers]).toBeDefined();
  }

  for (const key in theme.palette) {
    for (const key2 in theme.palette[key as keyof typeof theme.palette]) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect(typeof (theme.palette as any)[key][key2]).toBe('string');
    }
  }
});

test('helper functions work as intended', () => {
  expect(theme.helpers.first()).toBe(1);
  expect(theme.helpers.second()).toBe(theme.style.borderRadius * 2);
  expect(theme.helpers.withParams('foo')).toBe(theme.mode + ' ' + 'foobar');
  expect(theme.helpers.getColor('primary')).toBe(theme.palette.primary.main);
});
