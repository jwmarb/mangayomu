import { Colors, createTheme, DefaultTheme, DefaultThemeHelpers } from '..';

interface TestTheme extends DefaultTheme {
  helpers: typeof helpers & DefaultThemeHelpers;
}

interface CustomPaletteTheme extends DefaultTheme {
  palette: DefaultTheme['palette'] & {
    customPaletteColor: string;
    nested: {
      one: string;
    };
  };
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

let theme: TestTheme & { opposite: TestTheme };
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
  withUsingParsedThemeProperty: () => {
    return (theme: TestTheme) => {
      return theme.palette.primary.ripple;
    };
  },
  withCallingAnotherMethod: () => {
    return (theme: TestTheme) => {
      return theme.helpers.withMultipleParams(5, 10);
    };
  },
  // This is just a binary search recursion algorithm
  withRecursion: (arr: number[], target: number) => {
    return (theme: TestTheme) => {
      const m = Math.floor(arr.length / 2);
      if (arr.length === 1 && arr[0] !== target) return false;
      if (arr[m] === target) return true;
      else if (target < arr[m])
        return theme.helpers.withRecursion(
          arr.slice(0, m),
          target,
        ) as unknown as boolean;
      else if (target > arr[m])
        return theme.helpers.withRecursion(
          arr.slice(m),
          target,
        ) as unknown as boolean;
      return false;
    };
  },
  themeModeDependentFunction: (
    color:
      | Colors
      | 'primary@contrast'
      | 'secondary@contrast'
      | 'warning@contrast'
      | 'error@contrast',
  ) => {
    return (theme: TestTheme) => {
      return theme.helpers.getColor(color);
    };
  },
};

test('Theme object created and parsed properly', () => {
  theme = createTheme<TestTheme>(({ color, colorConstant }) => ({
    mode: 'light',
    palette: {
      error: {
        main: color('#f44336', '#d32f2f'),
        light: color('#e57373', '#ef5350'),
        dark: color('#d32f2f', '#c62828'),
      },
      warning: {
        main: color('#ed6c02', '#ffa726'),
        light: color('#ff9800', '#ffb74d'),
        dark: color('#e65100', '#f57c00'),
      },
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
      borderWidth: 4,
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
  expect(theme.helpers.isPaletteColor('primary')).toBe(true);
  expect(theme.helpers.withMultipleParams(2, 2)).toBe(4);
  expect(theme.helpers.withUsingParsedThemeProperty()).toBe(
    theme.palette.primary.ripple,
  );
  expect(theme.helpers.withCallingAnotherMethod()).toBe(15);
  expect(
    theme.helpers.withRecursion([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 4),
  ).toBe(true);
  expect(
    theme.helpers.withRecursion([0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10], 22),
  ).toBe(false);
});

test('palette in a different key is parsed', () => {
  theme2 = createTheme<ReactNavigationTheme>(
    ({ color, colorConstant, definePalette }) => ({
      mode: 'dark',
      palette: {
        error: {
          main: color('#f44336', '#d32f2f'),
          light: color('#e57373', '#ef5350'),
          dark: color('#d32f2f', '#c62828'),
        },
        warning: {
          main: color('#ed6c02', '#ffa726'),
          light: color('#ff9800', '#ffb74d'),
          dark: color('#e65100', '#f57c00'),
        },
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
        borderWidth: 4,
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

test('getContrastText', () => {
  const contrastColor1 = theme.helpers.getContrastText('rgb(255, 255, 255)'); // white background, so it should return a black text;
  const contrastColor2 = theme.helpers.getContrastText('#000000'); // black background, so it should return a white text;
  const contrastColor3 = theme.helpers.getContrastText('#FFFFFF'); // white background, so it should return a black text;
  expect(contrastColor1).toBe('rgba(0, 0, 0, 0.87)');
  expect(contrastColor2).toBe('rgba(255, 255, 255, 1)');
  expect(contrastColor3).toBe('rgba(0, 0, 0, 0.87)');
});

test('Custom palette color', () => {
  const theme3 = createTheme<CustomPaletteTheme>(
    ({ color, colorConstant }) => ({
      mode: 'light',
      palette: {
        customPaletteColor: color('#ffffff', '#000000'),
        nested: {
          one: color('#ffffff', '#000000'),
        },
        error: {
          main: color('#f44336', '#d32f2f'),
          light: color('#e57373', '#ef5350'),
          dark: color('#d32f2f', '#c62828'),
        },
        warning: {
          main: color('#ed6c02', '#ffa726'),
          light: color('#ff9800', '#ffb74d'),
          dark: color('#e65100', '#f57c00'),
        },
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
        borderWidth: 4,
        spacing: {
          s: 2,
          m: 6,
          l: 10,
          xl: 16,
        },
      },
      helpers,
    }),
  );

  expect(typeof theme3.palette.customPaletteColor).toBe('string');
  expect(theme3.palette.customPaletteColor).toBe('#000000');
  expect(typeof theme3.palette.nested.one).toBe('string');
  expect(theme3.palette.nested.one).toBe('#000000');
});

test('Opposite theme parsed properly', () => {
  expect(theme.opposite.palette.primary.main).toBe('#1890ff');
  expect(theme.opposite.mode).toBe('dark');
});

test('Opposite theme helpers work as intended', () => {
  expect(theme.opposite.helpers.themeModeDependentFunction('primary')).toBe(
    '#1890ff',
  );
  expect(
    theme.helpers.getContrastText(theme.opposite.palette.primary.main),
  ).toBe(
    theme.opposite.helpers.getContrastText(theme.opposite.palette.primary.main),
  );
});
