import useThemedProps from '@/hooks/useThemedProps';
import { createThemedProps } from '@/utils/theme';
import useIsDarkMode from '@/hooks/useIsDarkMode';
import { darkTheme, lightTheme } from '@/providers/theme';

const mockUseIsDarkMode = useIsDarkMode as jest.Mock;

jest.mock('@/hooks/useIsDarkMode', () => ({
  __esModule: true,
  default: jest.fn(),
}));
let themedProps: readonly [
  {
    style: {
      backgroundColor: string;
    };
  },
  {
    style: {
      backgroundColor: string;
    };
  },
];

beforeAll(() => {
  themedProps = createThemedProps((theme) => ({
    // Never pass inline styles in actual code because it creates new objects every render!
    // This is for testing purposes
    style: {
      backgroundColor: theme.palette.background.paper,
    },
  }));
});

test('uses themed props properly', () => {
  mockUseIsDarkMode.mockReturnValue(true);

  expect(useThemedProps(themedProps)).toEqual({
    style: { backgroundColor: darkTheme.palette.background.paper },
  });

  mockUseIsDarkMode.mockReturnValue(false);

  expect(useThemedProps(themedProps)).toEqual({
    style: { backgroundColor: lightTheme.palette.background.paper },
  });
});

test('uses themed props with contrast properly', () => {
  mockUseIsDarkMode.mockReturnValue(true);

  expect(useThemedProps(themedProps, true)).toEqual({
    style: { backgroundColor: lightTheme.palette.background.paper },
  });

  mockUseIsDarkMode.mockReturnValue(false);

  expect(useThemedProps(themedProps, true)).toEqual({
    style: { backgroundColor: darkTheme.palette.background.paper },
  });
});
