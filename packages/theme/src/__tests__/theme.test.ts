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

interface ReactNavigationTheme extends DefaultTheme {
  __react_navigation__: {
    dark: boolean;
    colors: {
      primary: string;
      background: string;
      text: string;
    };
  };
}

let theme: TestTheme;
let theme2: ReactNavigationTheme;

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
  withMultipleParams: (one: number, two: number) => {
    return () => {
      return one + two;
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
        disabled: color('#141414', '#fafafa'),
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
  expect(theme.helpers).toBeDefined();
  expect(theme.helpers.first()).toBe(1);
  expect(theme.helpers.second()).toBe(theme.style.borderRadius * 2);
  expect(theme.helpers.withParams('foo')).toBe(theme.mode + ' ' + 'foobar');
  expect(theme.helpers.getColor('primary')).toBe(theme.palette.primary.main);
  expect(theme.helpers.withMultipleParams(2, 2)).toBe(4);
});

test('palette in a different key is parsed', () => {
  theme2 = createTheme<ReactNavigationTheme>(
    ({ color, colorConstant, definePalette }) => ({
      mode: 'dark',
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
          disabled: color('#141414', '#fafafa'),
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
      helpers: {},
      __react_navigation__: {
        dark: false,
        colors: definePalette<
          ReactNavigationTheme['__react_navigation__']['colors']
        >({
          background: color('#fff', '#000'),
          primary: colorConstant('#1890ff'),
          text: colorConstant('#000'),
        }),
      },
    }),
  );
  expect(theme2.__react_navigation__.colors.background).toBe('#fff');
  expect(theme2.__react_navigation__.colors.primary).toBe('#1890ff');
  expect(theme2.__react_navigation__.colors.text).toBe('#000');
  expect(theme2.palette.primary.main).toBe('#1890ff');
});
